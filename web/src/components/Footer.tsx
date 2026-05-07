export function Footer() {
  return (
    <footer className="bg-ink text-bone">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-10 px-6 py-16 md:grid-cols-12 md:px-10">
        <div className="col-span-2 md:col-span-5">
          <div className="display text-6xl text-bone md:text-8xl">Roma</div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-bone/55">
            An autonomous real-world development company. AI, robots,
            construction, and development as one — one system that gets
            smarter with every building.
          </p>
        </div>

        <FooterCol
          title="Company"
          items={[
            { label: "Live", href: "#live" },
            { label: "Mission", href: "#mission" },
            { label: "Robotics & AI", href: "#robotics-ai" },
            { label: "Construction", href: "#construction" },
            { label: "Development", href: "#development" },
            { label: "Manifesto", href: "#manifesto" },
          ]}
        />
        <FooterCol
          title="Build with us"
          items={[
            { label: "Open roles", href: "#contact" },
            { label: "Partners", href: "#contact" },
            { label: "Press", href: "mailto:press@buildroma.ai" },
          ]}
        />
        <FooterCol
          title="Contact"
          items={[
            { label: "hello@buildroma.ai", href: "mailto:hello@buildroma.ai" },
            { label: "New York · London · Hong Kong", href: "#" },
          ]}
        />
      </div>

      <div className="border-t border-bone/10">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-6 py-6 font-mono text-[11px] uppercase tracking-[0.18em] text-bone/45 md:px-10">
          <span>© {new Date().getFullYear()} Roma Technologies</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div className="md:col-span-2">
      <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-bone/45">
        {title}
      </div>
      <ul className="mt-4 space-y-2">
        {items.map((it) => (
          <li key={it.label}>
            <a
              href={it.href}
              className="text-sm text-bone/85 transition-colors hover:text-rust"
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
