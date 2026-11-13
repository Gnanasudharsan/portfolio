import type { Architecture, ArchNode } from "@/data/types";
import { cn } from "@/lib/cn";

/**
 * Layered system diagram rendered on the server from structured data.
 * Desktop: columns per layer with curved connectors (SVG).
 * Mobile: the same graph as an ordered, stacked list — no horizontal scroll.
 */

const toneFill: Record<NonNullable<ArchNode["tone"]>, string> = {
  source: "var(--surface-2)",
  process: "var(--surface)",
  store: "var(--surface)",
  model: "var(--accent-soft)",
  serve: "var(--surface)",
  guard: "var(--teal-soft)",
};

const toneStroke: Record<NonNullable<ArchNode["tone"]>, string> = {
  source: "var(--line-strong)",
  process: "var(--line-strong)",
  store: "var(--line-strong)",
  model: "color-mix(in srgb, var(--accent) 45%, transparent)",
  serve: "var(--line-strong)",
  guard: "color-mix(in srgb, var(--teal) 45%, transparent)",
};

const NODE_W = 168;
const NODE_H = 58;
const COL_GAP = 58;
const ROW_GAP = 18;
const PAD_X = 8;
const HEAD = 34;

export function ArchitectureDiagram({ arch, compact = false }: { arch: Architecture; compact?: boolean }) {
  const cols = arch.layers.length;
  const byLayer = arch.layers.map((_, i) => arch.nodes.filter((n) => n.layer === i));
  const maxRows = Math.max(...byLayer.map((l) => l.length));
  const width = PAD_X * 2 + cols * NODE_W + (cols - 1) * COL_GAP;
  const height = HEAD + maxRows * NODE_H + (maxRows - 1) * ROW_GAP + 8;

  const pos = new Map<string, { x: number; y: number }>();
  byLayer.forEach((nodes, li) => {
    const colH = nodes.length * NODE_H + (nodes.length - 1) * ROW_GAP;
    const offset = (height - HEAD - colH) / 2;
    nodes.forEach((n, ri) => {
      pos.set(n.id, { x: PAD_X + li * (NODE_W + COL_GAP), y: HEAD + offset + ri * (NODE_H + ROW_GAP) });
    });
  });

  const titleId = `arch-${arch.nodes[0]?.id ?? "x"}-title`;

  return (
    <figure className={cn("w-full", compact ? "" : "card p-4 sm:p-6")}>
      {/* Desktop / tablet: SVG graph */}
      <div className="hidden md:block">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full"
          role="img"
          aria-labelledby={titleId}
        >
          <title id={titleId}>{`System architecture: ${arch.layers.join(" → ")}`}</title>
          <defs>
            <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L8 4 L0 8 z" fill="var(--fg-4)" />
            </marker>
          </defs>
          {arch.layers.map((l, i) => (
            <text
              key={l}
              x={PAD_X + i * (NODE_W + COL_GAP)}
              y={14}
              fill="var(--fg-4)"
              fontFamily="var(--font-mono)"
              fontSize="10.5"
              letterSpacing="0.06em"
            >
              {`${String(i + 1).padStart(2, "0")} ${l.toUpperCase()}`}
            </text>
          ))}
          {arch.edges.map((e) => {
            const a = pos.get(e.from);
            const b = pos.get(e.to);
            if (!a || !b) return null;
            const sameCol = Math.abs(a.x - b.x) < 1;
            let d: string;
            if (sameCol) {
              const x = a.x + NODE_W / 2;
              const y1 = a.y < b.y ? a.y + NODE_H : a.y;
              const y2 = a.y < b.y ? b.y : b.y + NODE_H;
              d = `M ${x} ${y1} L ${x} ${y2 + (a.y < b.y ? -2 : 2)}`;
            } else {
              const x1 = a.x + NODE_W;
              const y1 = a.y + NODE_H / 2;
              const x2 = b.x - 3;
              const y2 = b.y + NODE_H / 2;
              const mx = (x1 + x2) / 2;
              d = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
            }
            return (
              <g key={`${e.from}-${e.to}`}>
                <path d={d} fill="none" stroke="var(--line-strong)" strokeWidth="1.25" markerEnd="url(#arrow)" />
                {e.label && !sameCol && (
                  <text
                    x={(a.x + NODE_W + b.x) / 2}
                    y={(a.y + b.y) / 2 + NODE_H / 2 - 6}
                    textAnchor="middle"
                    fill="var(--fg-3)"
                    fontFamily="var(--font-mono)"
                    fontSize="10"
                  >
                    {e.label}
                  </text>
                )}
              </g>
            );
          })}
          {arch.nodes.map((n) => {
            const p = pos.get(n.id)!;
            const tone = n.tone ?? "process";
            return (
              <g key={n.id} transform={`translate(${p.x} ${p.y})`}>
                <rect
                  width={NODE_W}
                  height={NODE_H}
                  rx="9"
                  fill={toneFill[tone]}
                  stroke={toneStroke[tone]}
                  strokeWidth="1"
                />
                <text x="12" y="23" fill="var(--fg)" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">
                  {n.label}
                </text>
                {n.detail && (
                  <text x="12" y="41" fill="var(--fg-3)" fontSize="10" fontFamily="var(--font-sans)">
                    {n.detail.length > 31 ? `${n.detail.slice(0, 30)}…` : n.detail}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Mobile: ordered layers */}
      <ol className="flex flex-col gap-3 md:hidden" aria-label="System architecture by stage">
        {arch.layers.map((l, i) => (
          <li key={l} className="relative pl-7">
            <span className="absolute top-0.5 left-0 font-mono text-[11px] text-fg-4">{String(i + 1).padStart(2, "0")}</span>
            {i < arch.layers.length - 1 && <span className="absolute top-6 bottom-[-12px] left-[7px] w-px bg-line" aria-hidden />}
            <p className="eyebrow mb-2">{l}</p>
            <ul className="flex flex-col gap-1.5">
              {byLayer[i].map((n) => (
                <li
                  key={n.id}
                  className={cn(
                    "rounded-lg border px-3 py-2",
                    n.tone === "model" ? "border-accent/30 bg-accent-soft" : n.tone === "guard" ? "border-teal/30 bg-teal-soft" : "border-line bg-surface",
                  )}
                >
                  <span className="block text-[14px] font-medium text-fg">{n.label}</span>
                  {n.detail && <span className="block text-[12.5px] text-fg-3">{n.detail}</span>}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      {!compact && (
        <figcaption className="mt-5 flex flex-col gap-3 border-t border-line pt-4 text-[14px] text-fg-3 sm:flex-row sm:items-start sm:justify-between">
          <span className="max-w-2xl">{arch.caption}</span>
          <span className="flex shrink-0 gap-3 font-mono text-[11px] text-fg-4" aria-hidden>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm border border-accent/50 bg-accent-soft" /> model
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm border border-teal/50 bg-teal-soft" /> guardrail
            </span>
          </span>
        </figcaption>
      )}
    </figure>
  );
}
