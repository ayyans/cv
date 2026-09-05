"use client";

import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { profile } from "@/content/data";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] w-full items-center overflow-hidden px-6 pt-24 md:pt-32"
    >
      {/* Background grid + glow */}
      <div aria-hidden className="absolute inset-0 bg-grid-pattern opacity-60" />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/3 h-[480px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, var(--color-brand), transparent 70%)",
          opacity: 0.15,
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl">
        {profile.availableForWork && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-6 inline-flex"
          >
            <span className="inline-flex items-center gap-2 rounded-pill border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
              </span>
              Available for work
            </span>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
          className="text-4xl font-bold leading-[1.05] tracking-tight text-fg sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Hi, I&apos;m{" "}
          <span className="text-gradient-brand">{profile.name.split(" ")[0]}</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
          className="mt-4 text-2xl font-semibold tracking-tight text-fg-muted sm:text-3xl md:text-4xl"
        >
          {profile.roles.map((role, i) => (
            <span key={role}>
              <span className="text-gradient-brand">{role}</span>
              {i < profile.roles.length - 1 && (
                <span className="mx-2 text-fg-muted/50">·</span>
              )}
            </span>
          ))}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 }}
          className="mt-6 max-w-2xl text-base text-fg-muted sm:text-lg"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.35 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <a
            href="#projects"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-md bg-gradient-brand px-6 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-all duration-200 hover:shadow-xl hover:shadow-brand/40 hover:brightness-110 active:scale-[0.98]"
          >
            View projects
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </a>
          <a
            href="#contact"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-line bg-surface px-6 text-sm font-semibold text-fg transition-all duration-200 hover:border-brand/40 hover:bg-glass"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            Get in touch
          </a>
        </motion.div>
      </div>
    </section>
  );
}
