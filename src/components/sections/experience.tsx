"use client";

import { motion } from "motion/react";
import { Briefcase } from "lucide-react";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { experience } from "@/content/data";
import { formatRange } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const, delay },
  }),
};

export function Experience() {
  return (
    <SectionWrapper id="experience" className="border-t border-line bg-surface/50">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        custom={0}
        className="mb-12 max-w-2xl"
      >
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-brand-2">
          Experience
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          Where I&apos;ve worked
        </h2>
      </motion.div>

      <div className="relative">
        {/* Timeline line */}
        <div
          aria-hidden
          className="absolute left-[11px] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-brand via-accent to-transparent md:left-1/2 md:-translate-x-px"
        />

        <ol className="space-y-10">
          {experience.map((entry, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <motion.li
                key={entry.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                custom={0.1 + idx * 0.05}
                className="relative md:grid md:grid-cols-2 md:gap-12"
              >
                {/* Marker */}
                <span
                  aria-hidden
                  className="absolute left-0 top-2 flex h-6 w-6 items-center justify-center rounded-full border border-brand/40 bg-surface shadow-lg shadow-brand/20 md:left-1/2 md:-translate-x-1/2"
                >
                  <Briefcase className="h-3 w-3 text-brand-2" />
                </span>

                {/* Mobile: always left of line. Desktop: alternate. */}
                <div
                  className={`pl-10 md:pl-0 ${
                    isLeft ? "md:pr-12 md:text-right" : "md:col-start-2 md:pl-12"
                  }`}
                >
                  <div className="rounded-xl border border-line bg-surface p-5 transition-colors hover:border-brand/30">
                    <p className="text-xs font-medium uppercase tracking-wider text-fg-muted">
                      {formatRange(entry.start, entry.end)}
                      {entry.location ? ` · ${entry.location}` : ""}
                    </p>
                    <h3 className="mt-1.5 text-lg font-semibold text-fg">
                      {entry.role}
                    </h3>
                    <p className="text-sm font-medium text-brand-2">
                      {entry.company}
                    </p>
                    <ul
                      className={`mt-3 space-y-1.5 text-sm text-fg-muted ${
                        isLeft ? "md:text-right" : ""
                      }`}
                    >
                      {entry.bullets.map((b, i) => (
                        <li key={i} className="leading-relaxed">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </SectionWrapper>
  );
}
