"use client";

import { motion } from "motion/react";
import { ExternalLink, Github, FileText } from "lucide-react";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { projects } from "@/content/data";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const, delay },
  }),
};

const linkIcons = {
  live: ExternalLink,
  repo: Github,
  caseStudy: FileText,
};

const linkLabels = {
  live: "Live",
  repo: "Repo",
  caseStudy: "Case study",
};

export function Projects() {
  return (
    <SectionWrapper id="projects" className="border-t border-line">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        custom={0}
        className="mb-12 max-w-2xl"
      >
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-brand-2">
          Projects
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          Featured work
        </h2>
        <p className="mt-4 text-fg-muted">
          A few things I&apos;ve built or led. Edit{" "}
          <code className="rounded bg-glass px-1.5 py-0.5 font-mono text-xs">
            src/content/data.ts
          </code>{" "}
          to swap these for your own.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project, idx) => (
          <motion.article
            key={project.id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            custom={0.1 + idx * 0.05}
            className={cn(
              "group relative overflow-hidden rounded-xl border border-line bg-surface p-6",
              "transition-all duration-300 hover:-translate-y-1 hover:border-brand/40",
              "hover:shadow-2xl hover:shadow-brand/10"
            )}
          >
            {/* Subtle gradient glow on hover */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-brand), transparent 40%, var(--color-accent))",
                opacity: 0,
              }}
            />

            <div className="relative space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-semibold text-fg">{project.title}</h3>
                <span className="inline-flex shrink-0 items-center rounded-pill border border-brand/30 bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand-2">
                  {project.role}
                </span>
              </div>

              <p className="text-base font-medium text-fg">{project.outcome}</p>
              <p className="text-sm leading-relaxed text-fg-muted">
                {project.description}
              </p>

              <ul className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <li
                    key={t}
                    className="rounded-pill border border-line bg-glass px-2.5 py-0.5 font-mono text-xs text-fg-muted"
                  >
                    {t}
                  </li>
                ))}
              </ul>

              {(project.links.live ||
                project.links.repo ||
                project.links.caseStudy) && (
                <div className="flex flex-wrap items-center gap-4 pt-2 text-sm">
                  {(Object.keys(project.links) as Array<keyof typeof project.links>).map(
                    (key) => {
                      const href = project.links[key];
                      if (!href) return null;
                      const Icon = linkIcons[key];
                      return (
                        <a
                          key={key}
                          href={href}
                          target={href.startsWith("#") ? undefined : "_blank"}
                          rel={href.startsWith("#") ? undefined : "noopener noreferrer"}
                          className="inline-flex items-center gap-1.5 text-fg-muted transition-colors hover:text-brand-2"
                        >
                          <Icon className="h-3.5 w-3.5" aria-hidden />
                          {linkLabels[key]}
                        </a>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </SectionWrapper>
  );
}
