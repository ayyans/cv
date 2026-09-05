import type {
  Profile,
  StackCategory,
  Project,
  ExperienceEntry,
  QuickFact,
} from "./types";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  EDIT THIS FILE to make the portfolio yours.                    ║
 * ║  Everything the site displays lives here — no code required.    ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

export const profile: Profile = {
  name: "Ayman Yeddes",
  shortName: "Ayman",
  roles: ["Full-Stack Developer", "Project Manager"],
  tagline:
    "I build products end-to-end and ship them on time — from first commit to launch day.",
  location: "Tunisia",
  languages: ["English", "French", "Arabic"],
  yearsOfExperience: 9,
  focusAreas: ["Web Apps", "SaaS", "Internal Tools", "API Platforms"],
  bio:
    "I spend my days writing code in the morning and running projects in the afternoon. " +
    "I care about shipping software that people actually use, on schedules that don't slip. " +
    "Over the last nine years I've worked across the stack — TypeScript and React on the front, " +
    "Node and Postgres on the back, Kubernetes in production — and led cross-functional teams " +
    "to deliver it.",
  availableForWork: true,
  initials: "AY",
  email: "hello@yeddes.com",
  socials: [
    { label: "GitHub", icon: "Github", url: "https://github.com/" },
    { label: "LinkedIn", icon: "Linkedin", url: "https://linkedin.com/in/" },
    { label: "X (Twitter)", icon: "Twitter", url: "https://x.com/" },
    { label: "Email", icon: "Mail", url: "mailto:hello@yeddes.com" },
  ],
};

export const quickFacts: QuickFact[] = [
  { label: "Years of experience", value: `${profile.yearsOfExperience}+` },
  { label: "Location", value: profile.location },
  { label: "Languages", value: profile.languages.join(" · ") },
  { label: "Focus", value: "Web · SaaS · APIs" },
];

export const stack: StackCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    items: [
      { name: "TypeScript", icon: "FileCode" },
      { name: "React", icon: "Atom" },
      { name: "Next.js", icon: "Triangle" },
      { name: "Tailwind CSS", icon: "Palette" },
      { name: "Framer Motion", icon: "Sparkles" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    items: [
      { name: "Node.js", icon: "Server" },
      { name: "PostgreSQL", icon: "Database" },
      { name: "Prisma", icon: "Layers" },
      { name: "tRPC / REST", icon: "Plug" },
      { name: "Redis", icon: "Zap" },
    ],
  },
  {
    id: "infra",
    label: "Infra & DevOps",
    items: [
      { name: "Docker", icon: "Container" },
      { name: "Kubernetes", icon: "Boxes" },
      { name: "AWS", icon: "Cloud" },
      { name: "Vercel", icon: "Rocket" },
      { name: "GitHub Actions", icon: "Workflow" },
    ],
  },
  {
    id: "pm",
    label: "PM & Collaboration",
    items: [
      { name: "Linear", icon: "ListChecks" },
      { name: "Notion", icon: "NotebookPen" },
      { name: "Figma", icon: "PenTool" },
      { name: "Slack", icon: "MessageSquare" },
      { name: "Jira", icon: "KanbanSquare" },
    ],
  },
];

export const projects: Project[] = [
  {
    id: "project-1",
    title: "Acme Insights Dashboard",
    role: "Lead Dev",
    outcome: "Cut weekly reporting time by 60% for 200+ daily users.",
    description:
      "Real-time analytics dashboard for a B2B SaaS — from schema design to the React frontend. Built a custom DSL so PMs could ship new widgets without a redeploy.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Redis"],
    links: {
      live: "#",
      repo: "#",
      caseStudy: "#",
    },
    featured: true,
  },
  {
    id: "project-2",
    title: "Ops Console for Logistics",
    role: "Tech PM",
    outcome: "Coordinated a 4-person team to ship v1 in 11 weeks, on time.",
    description:
      "Internal tool for a logistics company to track shipments, exceptions, and SLAs. Owned the roadmap, scope, and engineering reviews; led architecture decisions but didn't write every line.",
    tech: ["React", "Node.js", "PostgreSQL", "Docker"],
    links: {
      live: "#",
      caseStudy: "#",
    },
    featured: true,
  },
  {
    id: "project-3",
    title: "Open Source CLI",
    role: "Solo",
    outcome: "1.2k GitHub stars, used by teams at two YC startups.",
    description:
      "A small CLI that scaffolds monorepos with sensible defaults. Started as a side project, grew into something other people use daily. Pure TypeScript, zero deps.",
    tech: ["TypeScript", "Node.js", "Commander"],
    links: {
      repo: "#",
    },
    featured: true,
  },
];

export const experience: ExperienceEntry[] = [
  {
    id: "exp-1",
    role: "Senior Full-Stack Developer · Tech Lead",
    company: "Independent / Contract",
    start: "2024-01",
    end: null,
    location: "Remote",
    bullets: [
      "Shipped two B2B SaaS products from kickoff to GA in 14 and 18 weeks.",
      "Lead a small distributed team of 2 devs + 1 designer across timezones.",
    ],
  },
  {
    id: "exp-2",
    role: "Project Manager · Full-Stack Developer",
    company: "Northstar Digital",
    start: "2021-06",
    end: "2023-12",
    location: "Tunisia (Hybrid)",
    bullets: [
      "Owned delivery for a 5-person squad building a customer portal; 96% on-time sprint rate.",
      "Designed and shipped the auth + billing surfaces, handling 50k+ monthly active users.",
    ],
  },
  {
    id: "exp-3",
    role: "Full-Stack Developer",
    company: "Brightline Studio",
    start: "2019-09",
    end: "2021-05",
    location: "Tunisia",
    bullets: [
      "Built marketing sites and small web apps for 12+ clients across retail, education, and finance.",
      "Introduced TypeScript and automated testing to a team that had neither before.",
    ],
  },
];
