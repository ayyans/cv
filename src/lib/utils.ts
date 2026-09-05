import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Conditionally compose className strings + dedupe Tailwind conflicts.
 * Example: cn("px-4 py-2", isActive && "bg-brand", "px-6") → "py-2 px-6 bg-brand"
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format an ISO month string ("2024-01") to a short display label.
 */
export function formatMonth(iso: string | null, opts: { presentLabel?: string } = {}): string {
  if (iso === null) return opts.presentLabel ?? "Present";
  const [year, month] = iso.split("-").map(Number);
  if (!year || !month) return iso;
  const date = new Date(Date.UTC(year, month - 1, 1));
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

/**
 * Format a date range for experience entries.
 */
export function formatRange(start: string, end: string | null): string {
  return `${formatMonth(start)} — ${formatMonth(end)}`;
}
