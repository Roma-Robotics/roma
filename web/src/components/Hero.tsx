import { motion, type Variants } from "framer-motion";
import { ArrowDownRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.05 * i, ease: EASE },
  }),
};

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen w-full overflow-hidden pt-28"
    >
      <BlueprintGrid />

      <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col px-6 pb-20 md:px-10">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={0}
          className="flex items-center gap-3"
        >
          <span className="size-2 rounded-full bg-rust" />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/60">
            Roma — AI &amp; robotics · construction · development
          </span>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-12 md:mt-16 md:grid-cols-12">
          <div className="md:col-span-9">
            <motion.h1
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={1}
              className="display text-[14vw] leading-[0.86] text-ink md:text-[10.5rem]"
            >
              Building
              <br />
              <span className="italic text-ink/90">tomorrow's</span>
              <br />
              world.
            </motion.h1>
          </div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={4}
            className="flex flex-col justify-end gap-6 md:col-span-3"
          >
            <p className="max-w-md text-base leading-relaxed text-ink/75 md:text-lg">
              Roma is an autonomous real-world development company. The
              robots, the construction, and the development as one —{" "}
              one system that gets smarter with every building.
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="#mission"
                className="group inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-3 font-mono text-[12px] uppercase tracking-[0.18em] text-bone transition-transform hover:-translate-y-0.5"
              >
                Read the charter
                <ArrowDownRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                />
              </a>
              <a
                href="#contact"
                className="inline-flex w-fit items-center gap-2 font-mono text-[12px] uppercase tracking-[0.18em] text-ink/70 underline-offset-4 hover:underline"
              >
                Or work with us
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={6}
          className="mt-20 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-ink/15 pt-10 md:mt-24 md:grid-cols-4"
        >
          <Stat k="$16T" v="Annual global construction spend" />
          <Stat k="0%" v="Real productivity growth in 70 years" />
          <Stat k="80%" v="Of jobsite work that is repeatable" />
          <Stat k="01" v="Vertically-integrated AI builder" />
        </motion.div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/50">
        scroll <span className="cursor-blink">▍</span>
      </div>
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="display text-4xl text-ink md:text-5xl">{k}</span>
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/55">
        {v}
      </span>
    </div>
  );
}

function BlueprintGrid() {
  return (
    <>
      {/* Soft warm wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 600px at 80% -10%, rgba(74,107,87,0.18), transparent 60%), radial-gradient(900px 500px at -10% 30%, rgba(138,166,146,0.15), transparent 70%)",
        }}
      />
      {/* Blueprint lines */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-[0.18]"
      >
        <defs>
          <pattern
            id="grid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#0a0a0a" strokeWidth="0.5" />
          </pattern>
          <pattern id="grid-fine" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#0a0a0a" strokeWidth="0.25" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-fine)" />
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </>
  );
}
