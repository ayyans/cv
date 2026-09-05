import { ArrowUp } from "lucide-react";
import { SocialIcon } from "@/components/ui/social-icon";
import { profile } from "@/content/data";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-brand text-xs font-bold text-white"
              aria-hidden
            >
              Y
            </span>
            <span className="font-semibold text-fg">
              {profile.shortName.toLowerCase()}.com
            </span>
          </div>
          <p className="text-sm text-fg-muted">
            © {year} {profile.name} · Built with Next.js
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-4" aria-label="Footer">
          {profile.socials.map((s) => (
            <SocialIcon key={s.label} social={s} size="sm" />
          ))}
        </nav>

        <a
          href="#top"
          className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-brand-2"
        >
          Back to top
          <ArrowUp className="h-3.5 w-3.5" aria-hidden />
        </a>
      </div>
    </footer>
  );
}
