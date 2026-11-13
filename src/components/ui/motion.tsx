"use client";

import { MotionConfig } from "motion/react";
import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Scroll reveal with IntersectionObserver + CSS (see `.reveal` in globals.css).
 * Styles only apply under `html.js`, so content is visible without JavaScript,
 * and the global reduced-motion rule removes the movement.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Tag = as as ElementType;
  return (
    <Tag
      ref={ref}
      className={`reveal ${className ?? ""}`}
      data-shown={shown || undefined}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}

/** Counts up once in view; the final value is server-rendered and announced to assistive tech. */
export function CountUp({ value, decimals = 0, className }: { value: number; decimals?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value.toFixed(decimals));

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - start) / 1100, 1);
        setDisplay((value * (1 - Math.pow(1 - p, 4))).toFixed(decimals));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, decimals]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{value.toFixed(decimals)}</span>
      <span aria-hidden>{display}</span>
    </span>
  );
}

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
