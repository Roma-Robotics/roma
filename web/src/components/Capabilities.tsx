import { motion } from "framer-motion";
import {
  Bot,
  Brain,
  Eye,
  HardHat,
  Wrench,
  Layers,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const items: {
  icon: LucideIcon;
  title: string;
  body: string;
  tag: string;
}[] = [
  {
    icon: Bot,
    title: "Autonomous Machines",
    body: "Purpose-built robots for the four heaviest hours of any jobsite — framing, drywall, MEP rough-in, finishes — engineered in-house for the way Roma actually builds.",
    tag: "fleet",
  },
  {
    icon: Eye,
    title: "Vigil",
    body: "Vigil watches the jobsite through cameras, lidar, and our own machines. It feeds Verissimus — “the truest one” — our ground-truth layer and living digital twin of every project.",
    tag: "perception",
  },
  {
    icon: Brain,
    title: "Construction Foundation Model",
    body: "An end-to-end model trained on every weld, pour, and panel Roma has ever placed. It sequences the day, dispatches the fleet, and rewrites itself overnight.",
    tag: "core",
  },
  {
    icon: Layers,
    title: "Aurelius OS",
    body: "The operating system that orchestrates the fleet. Aurelius assigns every task, sequences every machine, and keeps robots and crews moving as one — in real time, across the whole site.",
    tag: "orchestrate",
  },
  {
    icon: HardHat,
    title: "Roma as the GC",
    body: "We hold the contract, we hire the trades, we own the schedule. Robots and crews work on the same plan, ship from the same brain, and report to the same superintendent.",
    tag: "field",
  },
  {
    icon: Wrench,
    title: "In-house R&D",
    body: "Mechanical, electrical, controls, ML, structural, and field engineering under one roof. Every problem we hit on Monday is a hardware spec on Friday.",
    tag: "shop",
  },
];

export function Capabilities() {
  return (
    <section
      id="capabilities"
      className="relative bg-ink py-32 text-bone md:py-44"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionLabel num="04" text="Capabilities" />
            <h3 className="display mt-6 text-5xl md:text-7xl">
              AI.
              <br />
              <span className="italic text-bone/85">Robotics.</span>
              <br />
              Construction.
              <br />
              <span className="italic text-bone/85">Development.</span>
            </h3>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="text-lg leading-relaxed text-bone/75">
              Most robotics companies stop at the demo and ship a tool.
              Construction companies stop at the spreadsheet and ship a bid.
              Roma builds both, and stitches them together as a single
              operating company — one P&amp;L, one schedule, one model that
              keeps getting better.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-bone/10 bg-bone/10 md:mt-20 md:grid-cols-3">
          {items.map((it, i) => (
            <Capability key={it.title} {...it} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Capability({
  icon: Icon,
  title,
  body,
  tag,
  index,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  tag: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.6,
        delay: 0.04 * index,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative flex flex-col gap-5 bg-ink p-8 transition-colors duration-300 hover:bg-ink-2 md:p-10"
    >
      <div className="flex items-center justify-between">
        <div className="flex size-12 items-center justify-center rounded-xl border border-bone/15 bg-bone/[0.04] text-bone/80 transition-colors group-hover:border-silver/60 group-hover:text-silver">
          <Icon size={20} strokeWidth={1.6} />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-bone/40">
          /{tag}
        </span>
      </div>
      <h4 className="display text-3xl text-bone">{title}</h4>
      <p className="text-[15px] leading-relaxed text-bone/65">{body}</p>
      <div className="mt-2 h-px w-full origin-left scale-x-0 bg-silver transition-transform duration-500 group-hover:scale-x-100" />
    </motion.div>
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
