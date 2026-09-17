import { NextRequest } from "next/server";
import { site, features } from "@/lib/content";
import { buildSystemPrompt } from "@/lib/chat/knowledge";
import {
  checkTopicGate,
  rateLimit,
  MAX_MESSAGE_CHARS,
  MAX_TURNS,
  MAX_OUTPUT_TOKENS,
} from "@/lib/chat/guardrails";
import { getProvider, providerKeyPresent, type ChatMessage } from "@/lib/chat/provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Clinic assistant endpoint.
 *
 * The browser talks to this route on our own domain; the model provider is
 * never called from the client. The API key exists only in the server
 * environment — a key in a NEXT_PUBLIC_ variable is readable by anyone who
 * opens devtools, and billable by them.
 *
 * Nothing is persisted. No transcripts, no message content, no IP beyond the
 * ephemeral in-memory rate-limit counter. A clinic site that stores no
 * conversation content has dramatically less to worry about, and this route is
 * deliberately built so there is nothing to leak.
 */

function textResponse(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export async function POST(req: NextRequest) {
  // The assistant is switched off in content.ts. Refuse here too rather than
  // leaving a working endpoint behind a removed widget — the route is public
  // and reachable whether or not anything on the page calls it.
  if (!features.chatAssistant) {
    return textResponse(
      `The assistant isn't available. Please call or text the clinic at ${site.phoneDisplay}.`,
      503,
    );
  }

  // Vercel sets x-forwarded-for; fall back to a constant so a missing header
  // shares one bucket rather than bypassing the limit entirely.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const limit = rateLimit(ip);
  if (!limit.ok) {
    return textResponse(
      `You've sent a lot of messages in a short time. Give it a few minutes, or call the clinic at ${site.phoneDisplay}.`,
      429,
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return textResponse("Malformed request.", 400);
  }

  const raw = (payload as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0) {
    return textResponse("No messages supplied.", 400);
  }

  // Normalize and bound: trust nothing about shape, role or length.
  const messages: ChatMessage[] = raw
    .filter(
      (m): m is ChatMessage =>
        !!m &&
        typeof m === "object" &&
        typeof (m as ChatMessage).content === "string" &&
        ((m as ChatMessage).role === "user" ||
          (m as ChatMessage).role === "assistant"),
    )
    .slice(-MAX_TURNS)
    .map((m) => ({
      role: m.role,
      content: m.content.slice(0, MAX_MESSAGE_CHARS),
    }));

  const last = messages[messages.length - 1];
  if (!last || last.role !== "user" || !last.content.trim()) {
    return textResponse("Expected a user message.", 400);
  }

  // Deterministic gate: the cases that matter most never reach the model.
  const gate = checkTopicGate(last.content);
  if (gate.blocked) return textResponse(gate.reply);

  if (!providerKeyPresent()) {
    // Explicit and honest rather than a broken-looking empty reply.
    return textResponse(
      `The assistant isn't switched on yet. In the meantime, call or text the clinic at ${site.phoneDisplay}, or use the free screening form on this page.`,
      503,
    );
  }

  try {
    const stream = await getProvider().stream({
      system: buildSystemPrompt(),
      messages,
      maxTokens: MAX_OUTPUT_TOKENS,
      signal: req.signal,
    });

    return new Response(stream, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
        "x-accel-buffering": "no",
      },
    });
  } catch (err) {
    // Log the failure, never the conversation.
    console.error("[chat] provider error:", (err as Error).message);
    return textResponse(
      `Sorry — I'm having trouble answering right now. Please call or text the clinic at ${site.phoneDisplay}.`,
      502,
    );
  }
}
