"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

export function ShareButton({ title }: { title: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        const url = window.location.href;
        try {
          if (navigator.share) await navigator.share({ title, url });
          else {
            await navigator.clipboard.writeText(url);
            setDone(true);
            window.setTimeout(() => setDone(false), 1800);
          }
        } catch {
          /* user dismissed the share sheet */
        }
      }}
      className="inline-flex min-h-10 items-center gap-2 text-[13.5px] text-fg-3 hover:text-fg"
    >
      {done ? <Check size={14} className="text-teal" aria-hidden /> : <Share2 size={14} aria-hidden />}
      <span aria-live="polite">{done ? "Link copied" : "Share this case study"}</span>
    </button>
  );
}
