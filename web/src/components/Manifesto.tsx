import { motion } from "framer-motion";

const lines = [
  "We believe shelter is a solved problem masquerading as an unsolvable one.",
  "We believe atoms deserve the same exponential as bits.",
  "We believe robotics companies that sell tools to construction companies have it backwards. The tools and the operator should be the same company.",
  "We believe construction is the largest unindexed dataset on Earth, and the only way to index it is to do the work yourself.",
  "We believe the next great industrial company will be a robotics company, and the next great robotics company will pour concrete.",
];

export function Manifesto() {
  return (
    <section
      id="manifesto"
      className="relative overflow-hidden bg-rust py-32 text-bone md:py-44"
    >
      {/* Subtle architectural lines */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
      >
        <defs>
          <pattern id="m-grid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke="#f3efe6" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#m-grid)" />
      </svg>

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-bone/70">
          <span className="rounded-full border border-bone/40 px-2 py-0.5">
            04
          </span>
          Manifesto
        </div>

        <ul className="mt-12 flex flex-col gap-2 md:mt-16">
          {lines.map((line, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.8,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="display border-b border-bone/15 py-7 text-3xl leading-[1.15] text-bone md:text-5xl"
            >
              <span className="mr-4 align-top font-mono text-xs tracking-widest text-bone/60">
                {String(i + 1).padStart(2, "0")}
              </span>
              {line}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
