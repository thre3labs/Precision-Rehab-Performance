"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { site } from "@/lib/content";
import { MAX_MESSAGE_CHARS } from "@/lib/chat/guardrails";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING =
  "Hi! I can answer questions about our treatments, insurance, and the free 15-minute screening. What can I help with?";

const SUGGESTIONS = [
  "What is dry needling?",
  "Do you take Medicare?",
  "Where are you located?",
];

/**
 * Clinic assistant. Conversation state lives in this component and nowhere
 * else: it is not persisted to the server, to localStorage, or anywhere the
 * visitor's words outlive the tab. That is a privacy decision, not an
 * oversight — see CHATBOT_PLAN.md §5.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);

  const closeRef = useRef<HTMLButtonElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) closeRef.current?.focus();
    else fabRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, busy]);

  async function send(text: string) {
    const content = text.trim().slice(0, MAX_MESSAGE_CHARS);
    if (!content || busy) return;

    const next: Msg[] = [...msgs, { role: "user", content }];
    setMsgs([...next, { role: "assistant", content: "" }]);
    setDraft("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.body) throw new Error("no body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMsgs([...next, { role: "assistant", content: acc }]);
      }

      if (!acc.trim()) {
        setMsgs([
          ...next,
          {
            role: "assistant",
            content: `Sorry — I didn't get a reply that time. Please call or text the clinic at ${site.phoneDisplay}.`,
          },
        ]);
      }
    } catch {
      setMsgs([
        ...next,
        {
          role: "assistant",
          content: `Sorry — I'm having trouble connecting. Please call or text the clinic at ${site.phoneDisplay}.`,
        },
      ]);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  const showSuggestions = msgs.length === 0;

  return (
    <>
      <button
        className="chat-fab"
        type="button"
        ref={fabRef}
        aria-expanded={open}
        aria-controls="chatPanel"
        aria-label={open ? "Close the clinic assistant" : "Open the clinic assistant"}
        onClick={() => setOpen((v) => !v)}
      >
        <svg
          className="ico"
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{ width: "26px", height: "26px" }}
        >
          <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 20.5l1.5-4.7A8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4z" />
        </svg>
        <span className="badge" aria-hidden="true" />
      </button>

      <div
        className={`chat${open ? " chat-open" : ""}`}
        id="chatPanel"
        role="dialog"
        aria-label="Clinic assistant"
        hidden={!open}
      >
        <div className="chat-hd">
          <Image
            src="/images/mark-transparent.png"
            alt=""
            width={681}
            height={740}
          />
          <div>
            <b>Clinic Assistant</b>
            <span>Answers about treatments &amp; visits</span>
          </div>
          <button
            className="chat-x"
            type="button"
            ref={closeRef}
            onClick={() => setOpen(false)}
            aria-label="Close assistant"
          >
            <svg
              className="ico"
              viewBox="0 0 24 24"
              aria-hidden="true"
              style={{ width: "19px", height: "19px" }}
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div
          className="chat-body"
          ref={bodyRef}
          role="log"
          aria-live="polite"
          aria-atomic="false"
        >
          <div className="bub bot">{GREETING}</div>

          {showSuggestions && (
            <div className="chips">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {msgs.map((m, i) => (
            <div key={i} className={`bub ${m.role === "user" ? "me" : "bot"}`}>
              {m.content || (busy && i === msgs.length - 1 ? <Dots /> : null)}
            </div>
          ))}
        </div>

        <div className="chat-ft">
          <form
            className="chat-in"
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
          >
            <label htmlFor="chat-msg" className="sr-only">
              Ask the clinic assistant a question
            </label>
            <textarea
              id="chat-msg"
              ref={inputRef}
              rows={1}
              value={draft}
              maxLength={MAX_MESSAGE_CHARS}
              placeholder="Ask a question…"
              disabled={busy}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(draft);
                }
              }}
            />
            <button
              className="send"
              type="submit"
              disabled={busy || !draft.trim()}
              aria-label="Send message"
            >
              <svg
                className="ico"
                viewBox="0 0 24 24"
                aria-hidden="true"
                style={{ width: "17px", height: "17px" }}
              >
                <path d="m3 11 19-9-9 19-2-8-8-2z" />
              </svg>
            </button>
          </form>
          <p className="chat-flag">
            Automated assistant · general information only, not medical advice.
            Please don&rsquo;t share medical details.
          </p>
        </div>
      </div>
    </>
  );
}

function Dots() {
  return (
    <span className="dots" aria-label="Thinking">
      <i />
      <i />
      <i />
    </span>
  );
}
