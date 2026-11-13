import type { ChartSeries, Finding } from "@/data/types";
import { cn } from "@/lib/cn";

function fmt(v: number, unit: string) {
  const s = Number.isInteger(v) ? v.toLocaleString("en-US") : String(v);
  return unit === "%" ? `${s}%` : unit === "×" ? `${s}×` : unit ? `${s} ${unit}` : s;
}

/** Horizontal bar chart in HTML/CSS — accessible as a table, crisp at any width. */
export function BarChart({ chart, compact = false }: { chart: ChartSeries; compact?: boolean }) {
  const max = Math.max(...chart.bars.map((b) => b.high ?? b.value)) * 1.04;
  return (
    <figure className={cn(compact ? "" : "card p-5 sm:p-6")}>
      {!compact && (
        <figcaption className="mb-5">
          <p className="text-[15px] font-semibold text-fg">{chart.title}</p>
          {chart.subtitle && <p className="mt-1 font-mono text-[11.5px] text-fg-4">{chart.subtitle}</p>}
        </figcaption>
      )}
      <table className="w-full border-collapse">
        <caption className="sr-only">
          {chart.title}. {chart.better === "lower" ? "Lower is better." : "Higher is better."}
        </caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Variant</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {chart.bars.map((b) => {
            const pct = Math.max((b.value / max) * 100, 0.8);
            return (
              <tr key={b.label} className="align-middle">
                <th
                  scope="row"
                  className={cn(
                    "w-[38%] py-1.5 pr-3 text-left text-[12.5px] leading-tight font-normal sm:w-[34%] sm:text-[13px]",
                    b.highlight ? "text-fg" : "text-fg-3",
                  )}
                >
                  {b.label}
                </th>
                <td className="py-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="relative h-6 flex-1 rounded-[5px] bg-surface-2">
                      <div
                        className={cn("absolute inset-y-0 left-0 rounded-[5px]", b.highlight ? "bg-accent" : "bg-fg-4/45")}
                        style={{ width: `${pct}%` }}
                      />
                      {b.low !== undefined && b.high !== undefined && (
                        <div
                          className="absolute top-1/2 h-2.5 -translate-y-1/2 border-x border-fg/60"
                          style={{ left: `${(b.low / max) * 100}%`, width: `${((b.high - b.low) / max) * 100}%` }}
                          aria-hidden
                        >
                          <div className="absolute top-1/2 h-px w-full bg-fg/60" />
                        </div>
                      )}
                    </div>
                    <span className={cn("w-[4.25rem] shrink-0 text-right sm:w-[5.5rem] font-mono text-[12.5px] tabular-nums", b.highlight ? "text-fg" : "text-fg-3")}>
                      {fmt(b.value, chart.unit)}
                      {b.note && <span className="block text-[10.5px] leading-tight text-fg-4">{b.note}</span>}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {!compact && (chart.footnote || chart.source) && (
        <div className="mt-4 flex flex-col gap-1.5 border-t border-line pt-3 text-[12.5px] text-fg-4">
          {chart.footnote && <p>{chart.footnote}</p>}
          {chart.source && (
            <a href={chart.source} target="_blank" rel="noreferrer" className="link-underline w-fit font-mono text-[11.5px]">
              Source in repository ↗
            </a>
          )}
        </div>
      )}
    </figure>
  );
}

const verdictStyle: Record<Finding["verdict"], { dot: string; text: string; label: string }> = {
  robust: { dot: "bg-teal", text: "text-teal", label: "Robust" },
  fragile: { dot: "bg-amber", text: "text-amber", label: "Fragile" },
  unsupported: { dot: "bg-fg-4", text: "text-fg-3", label: "Not supported" },
  null: { dot: "bg-fg-4", text: "text-fg-3", label: "Null" },
};

/** Forest plot of percent effects with verdict coloring. */
export function ForestPlot({ findings, compact = false }: { findings: Finding[]; compact?: boolean }) {
  const pts = findings.filter((f) => f.point !== undefined);
  const lo = Math.min(...pts.map((f) => f.low ?? f.point!)) - 1.5;
  const hi = Math.max(...pts.map((f) => f.high ?? f.point!)) + 1.5;
  const x = (v: number) => ((v - lo) / (hi - lo)) * 100;
  const rows = compact ? pts.slice(0, 7) : pts;

  return (
    <figure className={cn(compact ? "" : "card p-5 sm:p-6")}>
      {!compact && (
        <figcaption className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[15px] font-semibold text-fg">Estimated 2025 effects, with each claim&apos;s verdict</p>
            <p className="mt-1 font-mono text-[11.5px] text-fg-4">Percent change · 95% CI where reliable · hollow = no reliable interval</p>
          </div>
          <ul className="flex gap-3 font-mono text-[11px]">
            {(["fragile", "unsupported", "null"] as const).map((v) => (
              <li key={v} className="flex items-center gap-1.5 text-fg-3">
                <span className={cn("size-2 rounded-full", verdictStyle[v].dot)} aria-hidden />
                {verdictStyle[v].label}
              </li>
            ))}
          </ul>
        </figcaption>
      )}
      <table className="w-full border-collapse">
        <caption className="sr-only">Estimated effects by outcome with confidence intervals and robustness verdicts.</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Outcome</th>
            <th scope="col">Estimate and interval</th>
            <th scope="col">Verdict</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((f) => {
            const v = verdictStyle[f.verdict];
            return (
              <tr key={f.outcome}>
                <th scope="row" className={cn("w-[42%] py-[5px] pr-3 text-left text-[12.5px] font-normal leading-tight text-fg-2", compact && "w-[46%] text-[12px]")}>
                  {f.outcome}
                </th>
                <td className="py-[5px]">
                  <div className="relative h-5">
                    <div className="absolute inset-y-0 w-px bg-fg-3/60" style={{ left: `${x(0)}%` }} aria-hidden />
                    {f.low !== undefined && f.high !== undefined && (
                      <div
                        className={cn("absolute top-1/2 h-[2px] -translate-y-1/2 rounded", v.dot)}
                        style={{ left: `${x(f.low)}%`, width: `${x(f.high) - x(f.low)}%` }}
                        aria-hidden
                      />
                    )}
                    <div
                      className={cn(
                        "absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
                        f.low === undefined ? "border-2 border-fg-3 bg-surface" : cn(v.dot, "ring-2 ring-surface"),
                      )}
                      style={{ left: `${x(f.point!)}%` }}
                      aria-hidden
                    />
                    <span className="sr-only">
                      {f.estimate}
                      {f.interval ? ` (${f.interval})` : ""}
                    </span>
                  </div>
                </td>
                <td className={cn("w-[4.5rem] py-[5px] pl-3 text-right font-mono text-[11.5px] whitespace-nowrap tabular-nums", !compact && "sm:w-[10rem]", v.text)}>
                  {f.estimate}
                  <span className="sr-only">, {v.label}</span>
                  {!compact && <span className="hidden text-[10.5px] text-fg-4 sm:inline"> · {v.label.toLowerCase()}</span>}
                </td>
              </tr>
            );
          })}
          <tr aria-hidden>
            <td />
            <td className="pt-1">
              <div className="relative h-4 font-mono text-[10.5px] text-fg-4">
                <span className="absolute left-0">{Math.round(lo)}%</span>
                <span className="absolute -translate-x-1/2" style={{ left: `${x(0)}%` }}>
                  0
                </span>
                <span className="absolute right-0">+{Math.round(hi)}%</span>
              </div>
            </td>
            <td />
          </tr>
        </tbody>
      </table>
    </figure>
  );
}
