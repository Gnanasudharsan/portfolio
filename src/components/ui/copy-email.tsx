"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

export function CopyEmail({ email, className }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        } catch {
          window.location.href = `mailto:${email}`;
        }
      }}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-full border border-line-strong bg-surface px-4 text-[14px] text-fg-2 transition-colors hover:text-fg",
        className,
      )}
      aria-label={copied ? "Email address copied" : `Copy email address ${email}`}
    >
      {copied ? <Check size={15} className="text-teal" aria-hidden /> : <Copy size={15} aria-hidden />}
      <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
    </button>
  );
}
