import { motion, type Variants } from "framer-motion";
import { EarthScene } from "./Earth";
import { CursorTrail } from "./Mars";

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
      className="relative min-h-screen w-full overflow-hidden bg-black pt-28 text-bone"
    >
      {/* Rotating dark-mode Earth backdrop with night-side city lights */}
      <EarthScene />
      <CursorTrail />

      {/* Sink the copy side into black so the text stays legible */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.82) 45%, rgba(0,0,0,0.35) 72%, rgba(0,0,0,0.15) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col px-6 pb-20 md:px-10">
        <div className="mt-12 grid grid-cols-1 gap-12 md:mt-16 md:grid-cols-12">
          <div className="md:col-span-8">
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={0}
              className="mb-8 flex items-center gap-3"
            >
              <span className="size-2 rounded-full bg-rust" />
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-bone/60">
                Roma — AI &amp; robotics · construction · development
              </span>
            </motion.div>
            <motion.h1
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={1}
              className="display text-[14vw] leading-[0.86] text-bone md:text-[10.5rem]"
            >
              Building
              <br />
              <span className="italic text-bone/90">tomorrow's</span>
              <br />
              universe.
            </motion.h1>
          </div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={4}
            className="flex flex-col gap-6 md:col-span-5 md:col-start-1"
          >
            <p className="max-w-md text-base leading-relaxed text-bone/75 md:text-lg">
              Roma is an autonomous building company. The
              robots, the construction, and the development as one —{" "}
              one system that gets smarter with every building.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={6}
          className="mt-20 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-bone/15 pt-10 md:mt-24 md:grid-cols-4"
        >
          <Stat k="$16T" v="Annual global construction spend" />
          <Stat k="0%" v="Real productivity growth in 70 years" />
          <Stat k="80%" v="Of jobsite work can be made more efficient" />
          <Stat k="01" v="Vertically-integrated AI builder" />
        </motion.div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/50">
        scroll <span className="cursor-blink">▍</span>
      </div>
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="display text-4xl text-bone md:text-5xl">{k}</span>
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-bone/55">
        {v}
      </span>
    </div>
  );
}
