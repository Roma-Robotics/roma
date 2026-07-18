import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const links = [
  { href: "#live", label: "Live" },
  { href: "#mission", label: "Mission" },
  { href: "#mars", label: "Beyond Earth" },
  { href: "#value", label: "Value" },
  { href: "#system", label: "System" },
  { href: "#robotics-ai", label: "Robotics & AI" },
  { href: "#construction", label: "Construction" },
  { href: "#development", label: "Development" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "bg-bone/85 backdrop-blur border-b border-ink/10"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-5 md:px-8 xl:px-10">
        <a href="#top" className="flex items-center gap-3">
          <Logo scrolled={scrolled} />
        </a>

        <ul className="hidden items-center gap-2.5 md:flex xl:gap-6">
          {links.map((l) => (
            <li key={l.href} className="whitespace-nowrap">
              <a
                href={l.href}
                className={`font-mono text-[10px] uppercase tracking-[0.08em] transition-colors xl:text-[11px] xl:tracking-[0.14em] ${
                  scrolled
                    ? "text-ink/70 hover:text-ink"
                    : "text-bone/70 hover:text-bone"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className={`group relative inline-flex items-center gap-2 whitespace-nowrap border px-3.5 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.12em] transition-colors hover:border-silver hover:text-silver xl:px-4 xl:text-[11px] xl:tracking-[0.16em] ${
            scrolled
              ? "border-ink/40 text-ink"
              : "border-bone/40 text-bone"
          }`}
        >
          <span className="size-1.5 rounded-full bg-rust" />
          Build with us
        </a>
      </nav>
    </motion.header>
  );
}

function Logo({ scrolled }: { scrolled: boolean }) {
  return (
    <span
      className={`display text-2xl tracking-tight transition-colors ${
        scrolled ? "text-ink" : "text-bone"
      }`}
    >
      Roma
    </span>
  );
}
