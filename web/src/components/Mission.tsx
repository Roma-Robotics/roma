import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Mission() {
  return (
    <section
      id="mission"
      className="relative bg-bone-2 py-32 md:py-44"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 md:grid-cols-12 md:gap-16 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-4"
        >
          <SectionLabel num="01" text="Mission" />
          <h3 className="display mt-6 text-5xl text-ink md:text-6xl">
            To build <em className="italic">tomorrow&apos;s</em> universe,
            <br />
            from earth to the universe,
            <br />
            for <em className="italic">everyone</em>
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-7 md:col-start-6"
        >
          <p className="display text-3xl leading-[1.15] text-ink md:text-4xl">
            Infrastructure is the largest sector on Earth and the least automated.
            For seventy years it has gotten <span className="italic">slower</span>,{" "}
            <span className="italic">more expensive</span>, and{" "}
            <span className="italic">less productive</span>.
          </p>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/75">
            Every robotics company so far has tried to sell hardware{" "}
            <span className="italic">into</span> construction. We don&apos;t.
            Roma is a{" "}
            <span className="text-ink font-medium">full stack development company</span>.
            Our perception stack, our planners, our autonomous machines, and
            our crews are all on the same team, working the same jobsite,
            accelerating and compounding from the same data.
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/75">
            That vertical integration is the unlock. It collapses the margin
            stack, kills the tooling-vs-operations split, and lets every
            building we deliver make the next one{" "}
            <span className="text-ink font-medium">cheaper</span>,{" "}
            <span className="text-ink font-medium">faster</span>, and{" "}
            <span className="text-ink font-medium">smarter</span>.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-ink/15 pt-8 md:grid-cols-3">
            <Fact k="1" v="Team. AI, robots, and humans." />
            <Fact k="1" v="Stack. Robotics, GC, and developer." />
            <Fact
              k="∞"
              v={
                <>
                  Compounding
                  <br />
                  performance
                </>
              }
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SectionLabel({ num, text }: { num: string; text: string }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink/55">
      <span className="rounded-full border border-ink/30 px-2 py-0.5">
        {num}
      </span>
      {text}
    </div>
  );
}

function Fact({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div>
      <div className="display text-3xl text-ink">{k}</div>
      <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55">
        {v}
      </div>
    </div>
  );
}
