import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TagProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "brand" | "mono";
}

export function Tag({ children, className, variant = "default" }: TagProps) {
  const variants = {
    default: "bg-glass border border-line text-fg-muted",
    brand: "bg-brand/10 border border-brand/30 text-brand-2",
    mono: "bg-glass border border-line text-fg-muted font-mono text-xs",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
