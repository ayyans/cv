/**
 * Content schema for the portfolio. Edit `src/content/data.ts`, not this file.
 * All fields are required unless marked `?` — typos fail the build.
 */

export type SocialKey = "github" | "linkedin" | "twitter" | "x" | "dribbble" | "instagram" | "email";

export interface Social {
  /** Display name shown on hover, e.g. "GitHub" */
  label: string;
  /** lucide-react icon name, e.g. "Github" */
  icon: SocialKey | string;
  /** Full URL, or `mailto:` for email */
  url: string;
}

export interface Profile {
  name: string;
  shortName: string;
  /** Two-line job title shown in the hero gradient text */
  roles: [string, string] | [string] | string[];
  /** One-line tagline under the headline */
  tagline: string;
  location: string;
  languages: string[];
  yearsOfExperience: number;
  focusAreas: string[];
  /** 3–5 sentences about you */
  bio: string;
  /** Toggles the "Available for work" pill in the hero */
  availableForWork: boolean;
  /** Initials shown in the avatar placeholder (2–3 chars) */
  initials: string;
  /** Primary contact email */
  email: string;
  /** All social/contact links */
  socials: Social[];
}

export type StackCategoryId = "frontend" | "backend" | "infra" | "pm";

export interface StackItem {
  name: string;
  /** lucide-react icon name, e.g. "Code2", "Server" */
  icon: string;
}

export interface StackCategory {
  id: StackCategoryId;
  label: string;
  items: StackItem[];
}

export type ProjectRole = "Lead Dev" | "Solo" | "Tech PM" | "Open Source" | "Contributor";

export interface ProjectLinks {
  live?: string;
  repo?: string;
  caseStudy?: string;
}

export interface Project {
  id: string;
  title: string;
  role: ProjectRole;
  /** One-line result/outcome (numbers are great here) */
  outcome: string;
  description: string;
  tech: string[];
  links: ProjectLinks;
  /** Shows in the "Featured" grid. Default true. */
  featured?: boolean;
}

export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  /** ISO month, e.g. "2024-01". null = current. */
  start: string;
  end: string | null;
  /** 1–2 outcome bullets, verb-led, max ~14 words each */
  bullets: string[];
  /** Optional location, e.g. "Remote" or "Algiers, Algeria" */
  location?: string;
}

export interface QuickFact {
  label: string;
  value: string;
}
