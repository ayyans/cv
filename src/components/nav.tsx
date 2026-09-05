"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { MobileMenu } from "@/components/mobile-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { profile } from "@/content/data";
import { cn } from "@/lib/utils";

const links = [
  { label: "About", href: "#about" },
  { label: "Stack", href: "#stack" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      style={{ opacity: navOpacity }}
      className={cn(
        "fixed inset-x-0 top-0 z-30 transition-all duration-300",
        scrolled
          ? "border-b border-line glass"
          : "border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <a
          href="#top"
          className="group flex items-center gap-2.5 font-semibold tracking-tight"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-brand text-sm font-bold text-white shadow-lg shadow-brand/30"
            aria-hidden
          >
            Y
          </span>
          <span className="text-fg">
            {profile.shortName.toLowerCase()}
            <span className="text-fg-muted">.com</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm text-fg-muted transition-colors hover:bg-glass hover:text-fg"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="#contact"
            className={cn(
              "hidden h-9 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium md:inline-flex",
              "bg-gradient-brand text-white shadow-lg shadow-brand/20",
              "transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
            )}
          >
            Get in touch
          </a>
          <MobileMenu links={[...links]} />
        </div>
      </div>
    </motion.header>
  );
}
