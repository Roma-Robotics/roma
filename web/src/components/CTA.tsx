import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export function CTA() {
  return (
    <section
      id="contact"
      className="relative bg-bone py-32 md:py-44"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink/55">
              <span className="rounded-full border border-ink/30 px-2 py-0.5">
                05
              </span>
              Join us
            </div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="display mt-6 text-6xl text-ink md:text-8xl"
            >
              The next century
              <br />
              gets built <em className="italic">here</em>.
            </motion.h3>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink/75">
              We are hiring roboticists, ML researchers, mechanical and
              controls engineers, structural designers, and people who have
              actually run construction sites. If you'd rather pour concrete
              than pitch a SaaS, talk to us. Equity is real. Mandate is total.
            </p>
          </div>

          <div className="md:col-span-5 md:col-start-8">
            <div className="rounded-2xl border border-ink/15 bg-bone-2/60 p-6 md:p-8">
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55">
                Open roles — wave 01
              </div>
              <ul className="mt-5 divide-y divide-ink/10">
                {roles.map((r) => (
                  <li
                    key={r.title}
                    className="group flex items-center justify-between gap-4 py-4"
                  >
                    <div>
                      <div className="font-medium text-ink">{r.title}</div>
                      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/55">
                        {r.team} · {r.location}
                      </div>
                    </div>
                    <ArrowUpRight
                      size={18}
                      className="text-ink/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-rust"
                    />
                  </li>
                ))}
              </ul>

              <a
                href="mailto:hello@roma.build?subject=Working%20with%20Roma"
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 font-mono text-[12px] uppercase tracking-[0.18em] text-bone transition-transform hover:-translate-y-0.5"
              >
                hello@roma.build
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const roles = [
  { title: "Founding Robotics Engineer", team: "Fleet", location: "NY / LDN" },
  { title: "Perception & SLAM Lead", team: "Atlas", location: "NY" },
  { title: "Foundation Model Researcher", team: "Core", location: "NY / Remote" },
  { title: "Mechanical Engineer — End Effectors", team: "Shop", location: "London" },
  { title: "Construction Superintendent", team: "Field", location: "Hong Kong" },
];
