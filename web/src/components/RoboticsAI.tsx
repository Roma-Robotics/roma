import { motion } from "framer-motion";
import { Bot, Brain, Eye, Cpu } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const pillars: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Bot,
    title: "Autonomous machines",
    body: "Purpose-built robots designed by Roma for the real work of construction — framing, pouring, finishing.",
  },
  {
    icon: Eye,
    title: "Live site perception",
    body: "A 3D, always-on understanding of the jobsite, fused from cameras, lidar, and our own machines.",
  },
  {
    icon: Brain,
    title: "Foundation model",
    body: "An end-to-end model trained on every action our fleet has ever taken — sequencing the day, dispatching the fleet.",
  },
  {
    icon: Cpu,
    title: "Closed learning loop",
    body: "Every weld, pour, and panel becomes training data for the next building. The system gets sharper with every project.",
  },
];

export function RoboticsAI() {
  return (
    <section
      id="robotics-ai"
      className="relative bg-bone py-32 md:py-44"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionLabel num="03" text="Robotics & AI" />
            <h3 className="display mt-6 text-5xl text-ink md:text-7xl">
              The intelligence
              <br />
              that <em className="italic">runs</em>
              <br />
              the site.
            </h3>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="text-lg leading-relaxed text-ink/75">
              Roma builds the AI and robotics stack from the ground up:
              perception, planning, controls, autonomy, and a foundation
              model trained on real construction. This is the engine that
              powers everything we do downstream.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 md:mt-20 md:grid-cols-2">
          {pillars.map((p, i) => (
            <Pillar key={p.title} {...p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Pillar({
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
        delay: 0.04 * index,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group flex gap-6 bg-bone p-8 transition-colors duration-300 hover:bg-bone-2 md:p-10"
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-ink/15 bg-ink/[0.04] text-ink/80 transition-colors group-hover:border-rust/60 group-hover:text-rust">
        <Icon size={20} strokeWidth={1.6} />
      </div>
      <div>
        <h4 className="display text-2xl text-ink md:text-3xl">{title}</h4>
        <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink/70">
          {body}
        </p>
      </div>
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
