import type { ReactNode } from "react";

/** Above-the-fold entrance as pure CSS: renders before hydration, removed under reduced motion. */
export function HeroReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <div className="hero-in" style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}
