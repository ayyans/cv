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
 *
 * Content source: Mohamed-Ayman-Yeddes-CV.docx (extracted 2026-09-06).
 */

export const profile: Profile = {
  name: "Mohamed Ayman Yeddes",
  shortName: "Ayman",
  roles: ["Full-Stack Developer", "IT Project Manager"],
  tagline:
    "I build ERP, POS, e-commerce and B2B systems end-to-end — from the database layer to the deployed server.",
  location: "Tunisia",
  languages: ["Arabic", "English", "French"],
  yearsOfExperience: 9,
  focusAreas: [
    "ERP & Business Apps",
    "POS & Inventory",
    "E-commerce & B2B",
    "Workflow Automation",
    "Team Leadership",
  ],
  bio:
    "I'm a full-stack engineer with 9+ years building production business software — " +
    "ERP, invoicing, POS, e-commerce, and B2B platforms — from the database layer " +
    "through to deployment. Twice I've joined a company as its first engineer, " +
    "built the IT function from zero, hired and led the team, and replaced " +
    "paper-based operations with automated systems. I work end-to-end: scoping " +
    "requirements with clients, architecting the solution, writing the code, and " +
    "shipping it across web, desktop, and mobile.",
  availableForWork: true,
  initials: "MAY",
  email: "Mohamed.ayman.yeddes@gmail.com",
  socials: [
    {
      label: "LinkedIn",
      icon: "Linkedin",
      url: "https://linkedin.com/in/mohamed-ayman-yeddes",
    },
    {
      label: "GitHub",
      icon: "Github",
      url: "https://github.com/ayyans",
    },
    {
      label: "Email",
      icon: "Mail",
      url: "mailto:Mohamed.ayman.yeddes@gmail.com",
    },
  ],
};

export const quickFacts: QuickFact[] = [
  { label: "Years of experience", value: `${profile.yearsOfExperience}+` },
  { label: "Location", value: profile.location },
  { label: "Languages", value: profile.languages.join(" · ") },
  { label: "Focus", value: "ERP · POS · E-commerce" },
];

export const stack: StackCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    items: [
      { name: "HTML", icon: "FileCode" },
      { name: "CSS", icon: "Palette" },
      { name: "JavaScript", icon: "FileCode" },
      { name: "jQuery", icon: "FileCode" },
      { name: "Dart", icon: "Code2" },
      { name: "Flutter", icon: "Smartphone" },
      { name: "WordPress", icon: "Globe" },
      { name: "WooCommerce", icon: "ShoppingCart" },
      { name: "PrestaShop", icon: "ShoppingBag" },
      { name: "Drupal", icon: "Layers" },
      { name: "Shopify", icon: "ShoppingBag" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    items: [
      { name: "PHP", icon: "Code2" },
      { name: "Laravel", icon: "Triangle" },
      { name: "CodeIgniter", icon: "Code2" },
      { name: "Java", icon: "Coffee" },
      { name: "C#", icon: "Hash" },
      { name: "WLanguage", icon: "Code2" },
      { name: "SQL Server", icon: "Database" },
      { name: "MySQL", icon: "Database" },
      { name: "HFSQL", icon: "Database" },
    ],
  },
  {
    id: "infra",
    label: "Infra & DevOps",
    items: [
      { name: "Docker", icon: "Container" },
      { name: "Git", icon: "GitBranch" },
      { name: "cPanel", icon: "Server" },
      { name: "Microsoft Azure", icon: "Cloud" },
      { name: "WinDev", icon: "AppWindow" },
      { name: "WinDev Mobile", icon: "Smartphone" },
    ],
  },
  {
    id: "pm",
    label: "PM & Tools",
    items: [
      { name: "Microsoft 365", icon: "Briefcase" },
      { name: "Meta for Business", icon: "Megaphone" },
      { name: "Moodle", icon: "GraduationCap" },
      { name: "DBeaver", icon: "Database" },
      { name: "Visual Studio", icon: "Code2" },
      { name: "Android Studio", icon: "Smartphone" },
    ],
  },
];

export const projects: Project[] = [
  {
    id: "bunyan-qa",
    title: "Bunyan.qa",
    role: "Tech PM",
    outcome:
      "Grew a B2B real-estate portal to 200+ active agencies and 5,000+ live listings.",
    description:
      "Joined as the first engineer and built Bunyan.qa into the platform the business runs on — Laravel + MySQL with a jQuery front end, containerized with Docker, with subscription-based accounts, search, and filtering. Also built a custom ERP on the same stack to replace an off-the-shelf tool.",
    tech: ["Laravel", "MySQL", "Docker", "jQuery", "Azure"],
    links: { live: "#", repo: "#", caseStudy: "#" },
    featured: true,
  },
  {
    id: "wwf-funds-workflow",
    title: "WWF Funds Request Workflow",
    role: "Lead Dev",
    outcome:
      "Cut request turnaround from days to hours by replacing a paper approval process.",
    description:
      "Role-based funds request workflow for the WWF foundation, built in Laravel with full audit trail and an integrated invoicing module. Shipped a Flutter companion app for card-based expense capture in the field.",
    tech: ["Laravel", "Flutter", "MySQL"],
    links: { live: "#", caseStudy: "#" },
    featured: true,
  },
  {
    id: "ncsc-archive",
    title: "NCSC Document Archive",
    role: "Lead Dev",
    outcome:
      "Indexed 20,000+ court case files into a searchable, role-based repository.",
    description:
      "Document archive management system for Tunisia's National Center of State Courts, built in CodeIgniter with structured metadata, full-text search, and access controls.",
    tech: ["CodeIgniter", "PHP", "MySQL"],
    links: { caseStudy: "#" },
    featured: true,
  },
  {
    id: "etic-moodle",
    title: "ETIC Moodle Learning Platform",
    role: "Lead Dev",
    outcome:
      "Moved 500+ students and 30+ training programs fully online with self-hosted Moodle.",
    description:
      "Deployed and administered a self-hosted Moodle platform on cPanel, with course structures, enrollment automation, certification modules, and role-based access that let instructors publish and track progress without IT support.",
    tech: ["Moodle", "cPanel", "PHP", "WordPress"],
    links: { live: "#" },
    featured: true,
  },
];

export const experience: ExperienceEntry[] = [
  {
    id: "etic",
    role: "IT Manager & Software Engineer",
    company: "ETIC Managerial Training Center",
    start: "2022-02",
    end: "2025-02",
    location: "Doha, Qatar",
    bullets: [
      "Deployed a self-hosted Moodle platform for 500+ students and 30+ training programs, with enrollment automation, certification modules, and role-based access.",
      "Rebuilt the corporate website and delivered several client sites on WordPress, wiring payment gateways, booking, and CRM through REST APIs and custom jQuery.",
      "Hired and led the IT team, managed digital marketing with Meta for Business, and automated internal workflows (reporting, notifications, document generation) on Microsoft 365.",
    ],
  },
  {
    id: "bunyan",
    role: "Software Engineer & Project Manager",
    company: "Bunyan Marketing",
    start: "2021-02",
    end: "2022-06",
    location: "Doha, Qatar",
    bullets: [
      "Joined as the first engineer and built Bunyan.qa into a B2B portal serving 200+ agencies and 5,000+ property listings, plus a custom ERP on Laravel + MySQL + Docker.",
      "Shipped the cross-platform Bunyan mobile app in Flutter for iOS and Android, alongside companion shop and salon management modules.",
      "Hired and led a 3-person IT team and owned all production infrastructure across cPanel and Microsoft Azure.",
    ],
  },
  {
    id: "digital-bundle",
    role: "Full-Stack Developer",
    company: "Digital Bundle",
    start: "2019-01",
    end: "2020-12",
    location: "Tunisia",
    bullets: [
      "Led a 3-developer team delivering custom applications for clients in finance, the public sector, and retail.",
      "Built the WWF funds request workflow in Laravel with role-based states, audit trail, invoicing, and a Flutter companion app for card-based expense capture.",
      "Delivered a CodeIgniter document archive for Tunisia's NCSC, indexing 20,000+ case files with structured metadata and access controls.",
    ],
  },
  {
    id: "ultimate-services",
    role: "Full-Stack Developer",
    company: "Ultimate Services",
    start: "2016-07",
    end: "2018-07",
    location: "Tunisia",
    bullets: [
      "Built an inventory and ERP desktop system in WinDev + HFSQL for a fabric wholesaler, managing 3,000+ products across stock movements, supplier orders, and invoicing.",
      "Developed a CodeIgniter logistics and delivery web app modelled on Aramex, covering intake, multi-stage approval, driver assignment, and printable dispatch orders.",
      "Shipped desktop salon appointment and e-commerce apps, and maintained a US client's WordPress site for a year with on-page SEO improvements.",
    ],
  },
];
