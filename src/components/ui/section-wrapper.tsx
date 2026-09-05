import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  id?: string;
  className?: string;
  children: ReactNode;
  /** Render as <section> by default; pass "div" for non-semantic cases. */
  as?: "section" | "div";
}

/**
 * Consistent vertical rhythm + max-width container for all page sections.
 * Provides the anchor ID used by the nav.
 */
export function SectionWrapper({
  id,
  className,
  children,
  as: Tag = "section",
}: SectionWrapperProps) {
  return (
    <Tag
      id={id}
      className={cn("relative w-full px-6 py-20 md:py-28", className)}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </Tag>
  );
}
