"use client";

import { motion } from "motion/react";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { stack } from "@/content/data";
import { Icon } from "@/lib/stack-icons";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const, delay },
  }),
};

export function TechStack() {
  return (
    <SectionWrapper id="stack" className="border-t border-line bg-surface/50">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        custom={0}
        className="mb-12 max-w-2xl"
      >
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-brand-2">
          Stack
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          What I work with
        </h2>
        <p className="mt-4 text-fg-muted">
          The tools I reach for daily, grouped by where they sit in the build.
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stack.map((category, catIdx) => (
          <motion.div
            key={category.id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            custom={0.1 + catIdx * 0.05}
            className="rounded-xl border border-line bg-surface p-5"
          >
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-fg">
              {category.label}
            </h3>
            <ul className="space-y-2">
              {category.items.map((item) => (
                <li
                  key={item.name}
                  className="group flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-glass"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-glass text-fg-muted transition-colors group-hover:text-brand-2">
                    <Icon name={item.icon} className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm text-fg-muted transition-colors group-hover:text-fg">
                    {item.name}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
