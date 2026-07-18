import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

export function Value() {
  return (
    <section id="value" className="relative bg-ink py-32 text-bone md:py-44">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-bone/45">
            <span className="rounded-full border border-bone/25 px-2 py-0.5">
              03
            </span>
            The value
          </div>
          <h3 className="display mt-6 max-w-4xl text-4xl leading-[1.1] text-bone md:text-6xl">
            One system for the whole build.
            <br />
            <span className="italic text-bone/70">
              Radically faster. Radically cheaper.
            </span>
          </h3>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-bone/10 bg-bone/10 md:mt-20 md:grid-cols-2">
          <Stat value={50} suffix="×" label="Faster" sub="From breaking ground to handover — the schedule collapses." />
          <Stat value={50} suffix="×" label="Cheaper" sub="Vertical integration kills the margin stack, top to bottom." />
        </div>
      </div>
    </section>
  );
}

function Stat({
  value,
  suffix,
  label,
  sub,
}: {
  value: number;
  suffix: string;
  label: string;
  sub: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toString());

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, {
        duration: 1.6,
        ease: [0.22, 1, 0.36, 1],
      });
      return controls.stop;
    }
  }, [inView, count, value]);

  return (
    <div ref={ref} className="bg-ink p-10 md:p-16">
      <div className="flex items-baseline">
        <motion.span className="display text-7xl leading-none text-bone md:text-[9rem]">
          {rounded}
        </motion.span>
        <span className="display text-5xl leading-none text-rust md:text-8xl">
          {suffix}
        </span>
      </div>
      <div className="mt-6 font-mono text-sm uppercase tracking-[0.22em] text-bone/80">
        {label}
      </div>
      <p className="mt-3 max-w-sm text-base leading-relaxed text-bone/55">
        {sub}
      </p>
    </div>
  );
}
