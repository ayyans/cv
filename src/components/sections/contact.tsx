"use client";

import { motion } from "motion/react";
import { Mail, ArrowUpRight } from "lucide-react";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { SocialIcon } from "@/components/ui/social-icon";
import { profile } from "@/content/data";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const, delay },
  }),
};

export function Contact() {
  return (
    <SectionWrapper id="contact" className="border-t border-line">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        custom={0}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-brand-2">
          Contact
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-fg sm:text-5xl">
          Let&apos;s build{" "}
          <span className="text-gradient-brand">something</span>.
        </h2>
        <p className="mt-4 text-lg text-fg-muted">
          Open to freelance, contract, and full-time roles. Drop a line — I
          usually reply within a day.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={`mailto:${profile.email}`}
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-md bg-gradient-brand px-7 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-all duration-200 hover:shadow-xl hover:shadow-brand/40 hover:brightness-110 active:scale-[0.98]"
          >
            <Mail className="h-4 w-4" aria-hidden />
            {profile.email}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </a>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {profile.socials.map((s) => (
            <SocialIcon key={s.label} social={s} size="md" />
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
