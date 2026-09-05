import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Adds the gradient glow border on hover (used for project cards). */
  interactive?: boolean;
}

export function Card({ children, className, interactive = false }: CardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-line bg-surface p-6",
        "transition-all duration-300",
        interactive &&
          "hover:-translate-y-1 hover:border-brand/40 hover:shadow-2xl hover:shadow-brand/10",
        className
      )}
    >
      {interactive && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{
            background:
              "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--color-brand), transparent 40%)",
            opacity: 0,
          }}
        />
      )}
      {children}
    </div>
  );
}
