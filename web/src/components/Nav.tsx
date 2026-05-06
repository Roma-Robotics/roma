import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const links = [
  { href: "#live", label: "Live" },
  { href: "#mission", label: "Mission" },
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
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
        <a href="#top" className="flex items-center gap-3">
          <Logo />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-mono text-[12px] uppercase tracking-[0.16em] text-ink/70 transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="group relative inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-bone transition-transform hover:-translate-y-0.5"
        >
          <span className="size-1.5 rounded-full bg-rust" />
          Build with us
        </a>
      </nav>
    </motion.header>
  );
}

function Logo() {
  return (
    <span className="display text-2xl tracking-tight text-ink">Roma</span>
  );
}
