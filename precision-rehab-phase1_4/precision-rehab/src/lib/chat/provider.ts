export type ChatMessage = { role: "user" | "assistant"; content: string };

export type ChatProvider = {
  name: string;
  /** Returns a stream of plain text deltas. */
  stream(args: {
    system: string;
    messages: ChatMessage[];
    maxTokens: number;
    signal?: AbortSignal;
  }): Promise<ReadableStream<Uint8Array>>;
};

/**
 * Both adapters talk to the provider's HTTP API with plain fetch rather than
 * an SDK. For two small streaming calls that is less code, one less dependency
 * to keep current, and no bundling surprises — and it keeps the provider
 * choice genuinely swappable with one environment variable.
 */

const encoder = new TextEncoder();

/** Shared SSE line reader: feeds raw chunks, yields complete `data:` payloads. */
async function* sseEvents(res: Response, signal?: AbortSignal) {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      if (signal?.aborted) break;
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let nl: number;
      while ((nl = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, nl).trim();
        buffer = buffer.slice(nl + 1);
        if (line.startsWith("data:")) yield line.slice(5).trim();
      }
    }
  } finally {
    reader.releaseLock();
  }
}

function textStream(
  gen: AsyncGenerator<string>,
): ReadableStream<Uint8Array> {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await gen.next();
      if (done) {
        controller.close();
        return;
      }
      if (value) controller.enqueue(encoder.encode(value));
    },
  });
}

async function assertOk(res: Response, who: string) {
  if (res.ok) return;
  const detail = await res.text().catch(() => "");
  // The body can echo request content; log a trimmed version only.
  throw new Error(`${who} responded ${res.status}: ${detail.slice(0, 300)}`);
}

export const anthropicProvider: ChatProvider = {
  name: "anthropic",
  async stream({ system, messages, maxTokens, signal }) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.CHAT_MODEL || "claude-haiku-4-5",
        max_tokens: maxTokens,
        stream: true,
        // The fact base is large and identical on every turn, which is exactly
        // what prompt caching is for: it turns the dominant per-turn cost into
        // a cache read.
        system: [
          { type: "text", text: system, cache_control: { type: "ephemeral" } },
        ],
        messages,
      }),
    });
    await assertOk(res, "Anthropic");

    async function* deltas() {
      for await (const data of sseEvents(res, signal)) {
        if (data === "[DONE]") return;
        try {
          const evt = JSON.parse(data);
          if (evt.type === "content_block_delta" && evt.delta?.type === "text_delta") {
            yield evt.delta.text as string;
          }
        } catch {
          /* keep-alive or partial frame; ignore */
        }
      }
    }
    return textStream(deltas());
  },
};

export const openaiProvider: ChatProvider = {
  name: "openai",
  async stream({ system, messages, maxTokens, signal }) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
      },
      body: JSON.stringify({
        model: process.env.CHAT_MODEL || "gpt-4.1-mini",
        max_tokens: maxTokens,
        stream: true,
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });
    await assertOk(res, "OpenAI");

    async function* deltas() {
      for await (const data of sseEvents(res, signal)) {
        if (data === "[DONE]") return;
        try {
          const evt = JSON.parse(data);
          const t = evt.choices?.[0]?.delta?.content;
          if (typeof t === "string") yield t;
        } catch {
          /* ignore */
        }
      }
    }
    return textStream(deltas());
  },
};

export function getProvider(): ChatProvider {
  return (process.env.CHAT_PROVIDER || "anthropic") === "openai"
    ? openaiProvider
    : anthropicProvider;
}

export function providerKeyPresent(): boolean {
  return (process.env.CHAT_PROVIDER || "anthropic") === "openai"
    ? Boolean(process.env.OPENAI_API_KEY)
    : Boolean(process.env.ANTHROPIC_API_KEY);
}
