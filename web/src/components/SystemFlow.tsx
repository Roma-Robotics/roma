import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Brain,
  Boxes,
  Eye,
  Network,
  RefreshCw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const stages: {
  icon: LucideIcon;
  name: string;
  role: string;
  description: string;
}[] = [
  {
    icon: Eye,
    name: "Vigil watches",
    role: "Live perception",
    description: "Cameras, lidar, and machines watch the live jobsite.",
  },
  {
    icon: Boxes,
    name: "Verissimus knows",
    role: "Ground truth",
    description: "The digital twin knows the true state of every project.",
  },
  {
    icon: Brain,
    name: "Augur foresees",
    role: "Simulation",
    description: "Simulation tests what happens next before work begins.",
  },
  {
    icon: Network,
    name: "Aurelius decides",
    role: "Orchestration",
    description: "The operating system sequences, assigns, and adapts every task.",
  },
  {
    icon: Bot,
    name: "Agrippa builds",
    role: "Execution",
    description: "Robots and crews execute the plan in the physical world.",
  },
];

export function SystemFlow() {
  return (
    <section id="system" className="relative overflow-hidden bg-bone-2 py-32 md:py-44">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 gap-8 md:grid-cols-12"
        >
          <div className="md:col-span-6">
            <SectionLabel num="05" text="The system" />
            <h3 className="display mt-6 text-5xl text-ink md:text-7xl">
              One loop.
              <br />
              Every part
              <br />
              <em className="italic">connected.</em>
            </h3>
          </div>
          <div className="flex items-end md:col-span-5 md:col-start-8">
            <p className="max-w-xl text-lg leading-relaxed text-ink/70">
              Roma is not a collection of separate tools. Perception, the
              digital twin, intelligence, orchestration, and machines operate
              as one closed system—each action improving the next.
            </p>
          </div>
        </motion.div>

        <div className="mt-16 md:mt-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="mb-4 flex items-center justify-between rounded-xl bg-ink px-6 py-5 text-bone md:mb-6 md:px-8"
          >
            <span className="display text-3xl">Roma</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/50">
              Autonomous delivery system
            </span>
          </motion.div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] md:items-stretch md:gap-2">
            {stages.map((stage, index) => (
              <FlowStage
                key={stage.name}
                {...stage}
                index={index}
                showArrow={index < stages.length - 1}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scaleX: 0.9 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-4 flex items-center justify-center gap-3 rounded-xl border border-ink/10 bg-bone px-5 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55 md:mt-6"
          >
            <RefreshCw size={14} strokeWidth={1.6} className="text-silver" />
            Every completed action returns as data and improves the entire Roma
            system
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FlowStage({
  icon: Icon,
  name,
  role,
  description,
  index,
  showArrow,
}: {
  icon: LucideIcon;
  name: string;
  role: string;
  description: string;
  index: number;
  showArrow: boolean;
}) {
  const [system, action] = name.split(" ");

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{
          duration: 0.6,
          delay: index * 0.08,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="group flex min-h-60 flex-col rounded-xl border border-ink/10 bg-bone p-6 transition-colors hover:bg-white/50"
      >
        <div className="flex items-center justify-between">
          <div className="flex size-11 items-center justify-center rounded-lg border border-ink/15 text-ink/70 transition-colors group-hover:border-silver group-hover:text-silver">
            <Icon size={19} strokeWidth={1.6} />
          </div>
          <span className="font-mono text-[10px] tracking-[0.18em] text-ink/35">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="mt-auto pt-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">
            {role}
          </div>
          <h4 className="display mt-2 text-2xl text-ink">
            <span className="block">{system}</span>
            <span className="block">{action}</span>
          </h4>
          <p className="mt-3 text-sm leading-relaxed text-ink/60">
            {description}
          </p>
        </div>
      </motion.div>

      {showArrow && (
        <div className="flex items-center justify-center py-1 text-ink/30 md:py-0">
          <ArrowRight
            size={18}
            strokeWidth={1.4}
            className="rotate-90 md:rotate-0"
          />
        </div>
      )}
    </>
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
