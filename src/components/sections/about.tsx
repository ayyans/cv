"use client";

import { motion } from "motion/react";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { profile, quickFacts } from "@/content/data";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const, delay },
  }),
};

export function About() {
  return (
    <SectionWrapper id="about" className="border-t border-line">
      <div className="grid gap-12 md:grid-cols-[1fr,2fr] md:gap-16">
        {/* Left: heading + avatar */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          custom={0}
          className="space-y-6"
        >
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-brand-2">
              About
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">
              Who I am
            </h2>
          </div>

          <div className="relative inline-block">
            <div
              aria-hidden
              className="absolute -inset-1 rounded-2xl bg-gradient-brand opacity-60 blur-md"
            />
            <div
              className="relative flex h-40 w-40 items-center justify-center rounded-2xl bg-surface text-5xl font-bold text-gradient-brand sm:h-48 sm:w-48 sm:text-6xl"
              aria-hidden
            >
              {profile.initials}
            </div>
          </div>
        </motion.div>

        {/* Right: bio + facts */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          custom={0.1}
          className="space-y-8"
        >
          <p className="text-lg leading-relaxed text-fg-muted">{profile.bio}</p>

          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {quickFacts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-lg border border-line bg-surface p-4"
              >
                <dt className="text-xs font-medium uppercase tracking-wider text-fg-muted">
                  {fact.label}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-fg">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap gap-2">
            {profile.focusAreas.map((area) => (
              <span
                key={area}
                className="inline-flex items-center rounded-pill border border-line bg-glass px-3 py-1 text-xs font-medium text-fg-muted"
              >
                {area}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
