"use client";

import { useEffect, useRef, useState } from "react";

export const REQUEST_TEMPLATE = `Hi Victor — I'm interested in the $200 Musashi sample pilot.

Our product:
The sources or topics our agent needs:
Which markets we cover:
What our current feed is missing:

Could we discuss a scoped pilot?`;

export default function RequestReview() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    function openRequestedReview() {
      if (
        ["#request", "#pilot"].includes(window.location.hash) &&
        !dialog.current?.open
      ) {
        dialog.current?.showModal();
      }
    }
    openRequestedReview();
    window.addEventListener("hashchange", openRequestedReview);
    return () => window.removeEventListener("hashchange", openRequestedReview);
  }, []);
  function clearRequestHash() {
    if (["#request", "#pilot"].includes(window.location.hash)) {
      window.history.replaceState(
        window.history.state,
        "",
        window.location.pathname + window.location.search,
      );
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(REQUEST_TEMPLATE);
      setCopied(true);
      setFailed(false);
    } catch {
      setFailed(true);
      setCopied(false);
    }
  }
  return (
    <>
      <button
        className="button button-primary"
        onClick={() => dialog.current?.showModal()}
      >
        Discuss a $200 pilot ↗
      </button>
      <dialog
        className="review-dialog"
        ref={dialog}
        aria-labelledby="request-title"
        onClose={clearRequestHash}
      >
        <button
          className="dialog-close"
          aria-label="Close pilot request"
          onClick={() => dialog.current?.close()}
        >
          ×
        </button>
        <h2 id="request-title">Let’s talk about your feed.</h2>
        <p>
          Tell Victor what you’re building and which data your agent is missing.
          We’ll discuss whether the $200 sample pilot fits your use case.
        </p>
        <a
          className="button button-primary"
          href="https://x.com/RotcivWho"
          target="_blank"
          rel="noopener noreferrer"
        >
          Message @RotcivWho
        </a>
        <details className="request-template">
          <summary>Copy a message to start</summary>
          <label htmlFor="request-text" className="sr-only">
            Pilot discussion message
          </label>
          <textarea
            id="request-text"
            readOnly
            value={REQUEST_TEMPLATE}
            rows={6}
          />
          <button className="button button-outline" onClick={copy}>
            {copied ? "Copied ✓" : "Copy message"}
          </button>
          <p role="status" className="small muted">
            {failed
              ? "Select and copy the text above if the clipboard is unavailable."
              : copied
                ? "Copied. Send it through our X profile."
                : "Nothing is submitted on this website."}
          </p>
        </details>
        <p className="dialog-terms">
          The sample pilot is $200 one-time for one use case and up to 25 public
          inputs you supply. Scope and timing are confirmed before payment. A
          production feed is quoted separately.
        </p>
        <a className="text-link" href="/docs/">
          Read the pilot overview →
        </a>
      </dialog>
    </>
  );
}
