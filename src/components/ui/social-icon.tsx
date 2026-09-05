import { Icon } from "@/lib/stack-icons";
import { cn } from "@/lib/utils";
import type { Social } from "@/content/types";

interface SocialIconProps {
  social: Social;
  size?: "sm" | "md";
}

export function SocialIcon({ social, size = "md" }: SocialIconProps) {
  const sizeClass = size === "sm" ? "h-9 w-9" : "h-11 w-11";
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <a
      href={social.url}
      target={social.url.startsWith("mailto:") ? undefined : "_blank"}
      rel={social.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
      aria-label={social.label}
      className={cn(
        "inline-flex items-center justify-center rounded-md border border-line bg-surface",
        "text-fg-muted transition-all duration-200",
        "hover:border-brand/50 hover:text-brand-2 hover:-translate-y-0.5",
        sizeClass
      )}
    >
      <Icon name={social.icon} className={iconSize} />
    </a>
  );
}
