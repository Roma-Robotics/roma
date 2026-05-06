const items = [
  "robotics",
  "perception",
  "planning",
  "framing",
  "drywall",
  "concrete",
  "steel",
  "MEP",
  "finishes",
  "modular fab",
  "general contracting",
  "development",
];

export function Marquee() {
  return (
    <section
      aria-label="What we automate"
      className="relative overflow-hidden border-y border-ink/15 bg-ink py-6 text-bone"
    >
      <div className="flex w-max marquee-track gap-12 whitespace-nowrap">
        {[...items, ...items, ...items].map((it, i) => (
          <div
            key={i}
            className="flex items-center gap-12 font-mono text-[11px] uppercase tracking-[0.32em] text-bone/80"
          >
            <span className="size-1.5 rounded-full bg-rust" />
            {it}
          </div>
        ))}
      </div>
    </section>
  );
}
