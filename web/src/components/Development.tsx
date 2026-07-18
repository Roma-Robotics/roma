import { motion } from "framer-motion";
import { Building2, Hammer, Map } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const items: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Map,
    title: "Source",
    body: "We source land and opportunities directly, underwritten by what our AI stack actually knows about cost and time to build.",
  },
  {
    icon: Building2,
    title: "Shape",
    body: "Designs are tuned to what Roma can build — tighter feedback loops between architecture, engineering, and execution.",
  },
  {
    icon: Hammer,
    title: "Own",
    body: "We own outcomes, not bids. Real-world results feed back into the model — closing the loop from intelligence to assets.",
  },
];

export function Development() {
  return (
    <section
      id="development"
      className="relative bg-bone-2 py-32 md:py-44"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionLabel num="08" text="Development" />
            <h3 className="display mt-6 text-5xl text-ink md:text-7xl">
              From bidder
              <br />
              to <em className="italic">builder</em>
              <br />
              of <em className="italic">tomorrow.</em>
            </h3>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="text-lg leading-relaxed text-ink/75">
              On top of Robotics &amp; AI and Construction sits Development.
              Roma takes on the role of developer: shaping projects,
              underwriting them with our own data, and standing behind the
              outcomes — not just the line items.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 md:mt-20 md:grid-cols-3">
          {items.map((it, i) => (
            <Card key={it.title} {...it} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({
  icon: Icon,
  title,
  body,
  index,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.6,
        delay: 0.05 * index,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group flex flex-col gap-5 bg-bone-2 p-8 transition-colors duration-300 hover:bg-bone md:p-10"
    >
      <div className="flex size-12 items-center justify-center rounded-xl border border-ink/15 bg-ink/[0.04] text-ink/80 transition-colors group-hover:border-silver/60 group-hover:text-silver">
        <Icon size={20} strokeWidth={1.6} />
      </div>
      <h4 className="display text-3xl text-ink md:text-4xl">{title}</h4>
      <p className="text-[15px] leading-relaxed text-ink/70">{body}</p>
      <div className="mt-2 h-px w-full origin-left scale-x-0 bg-silver transition-transform duration-500 group-hover:scale-x-100" />
    </motion.div>
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
