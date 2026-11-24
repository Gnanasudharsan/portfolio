"use client";

import { MotionConfig } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState, type ElementType, type ReactNode } from "react";

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

/**
 * Odometer-style number: each digit rolls up through a full lap to its value
 * once the number is half in view. The final value is server-rendered (so it
 * reads correctly without JS) and announced to assistive tech.
 */
export function RollingNumber({
  value,
  decimals = 0,
  delay = 0,
  className,
}: {
  value: number;
  decimals?: number;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const text = value.toFixed(decimals);

  // Before first paint, wind every digit back to 0; roll forward once in view.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const strips = [...el.querySelectorAll<HTMLElement>("[data-strip]")];
    for (const s of strips) s.style.transform = "translateY(0)";
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        raf = requestAnimationFrame(() => {
          void el.offsetHeight; // commit the wound-back position before transitioning
          strips.forEach((s, j) => {
            s.style.transition = `transform 1.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay + j * 0.08}s`;
            s.style.transform = `translateY(-${s.dataset.strip}em)`;
          });
        });
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [delay]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline-flex">
        {[...text].map((ch, i) => {
          if (!/\d/.test(ch)) return <span key={i}>{ch}</span>;
          const d = Number(ch);
          const stop = 10 + d; // one full lap, then the digit
          return (
            <span key={i} className="relative inline-block h-[1em] overflow-hidden leading-none">
              <span className="invisible">{ch}</span>
              <span
                data-strip={stop}
                className="absolute inset-x-0 top-0 flex flex-col will-change-transform"
                style={{ transform: `translateY(-${stop}em)` }}
              >
                {Array.from({ length: stop + 1 }, (_, n) => (
                  <span key={n} className="block h-[1em] leading-none">
                    {n % 10}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
