import { motion } from "framer-motion";

const steps = [
  {
    k: "01",
    title: "Mobilize",
    body: "Crews, robots, and modules arrive at the site as one orchestrated team — sequenced and dispatched by the same system.",
  },
  {
    k: "02",
    title: "Build",
    body: "Roma is the GC. We control the schedule, the quality, and the work — humans and machines pulling against the same plan.",
  },
  {
    k: "03",
    title: "Compound",
    body: "Every operation is logged and learned. Each completed building makes the next one faster, cheaper, and more predictable.",
  },
];

export function Construction() {
  return (
    <section
      id="construction"
      className="relative bg-ink py-32 text-bone md:py-44"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionLabel num="04" text="Construction" />
            <h3 className="display mt-6 text-5xl md:text-7xl">
              <span className="block">We don&apos;t deliver</span>
              <em className="block italic text-bone/85">technology.</em>
              <span className="block">We deliver</span>
              <em className="block italic text-bone/85">projects.</em>
            </h3>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="text-lg leading-relaxed text-bone/75">
              Roma operates as the construction company itself — one team
              of AI, robots, and humans, on one P&amp;L, on one jobsite.
              This is where the AI stack gets pressure-tested in the real
              world, every single day.
            </p>
          </div>
        </div>

        <ol className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-bone/10 bg-bone/10 md:mt-20 md:grid-cols-3">
          {steps.map((s, i) => (
            <Step key={s.k} {...s} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Step({
  k,
  title,
  body,
  index,
}: {
  k: string;
  title: string;
  body: string;
  index: number;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.6,
        delay: 0.05 * index,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative flex flex-col gap-5 bg-ink p-8 transition-colors duration-300 hover:bg-ink-2 md:p-10"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-bone/45">
          {k}
        </span>
        <span className="size-1.5 rounded-full bg-rust" />
      </div>
      <h4 className="display text-3xl text-bone md:text-4xl">{title}</h4>
      <p className="text-[15px] leading-relaxed text-bone/65">{body}</p>
      <div className="mt-2 h-px w-full origin-left scale-x-0 bg-rust transition-transform duration-500 group-hover:scale-x-100" />
    </motion.li>
  );
}

function SectionLabel({ num, text }: { num: string; text: string }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-bone/55">
      <span className="rounded-full border border-bone/30 px-2 py-0.5">
        {num}
      </span>
      {text}
    </div>
  );
}
