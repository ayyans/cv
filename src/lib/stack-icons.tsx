import {
  Atom,
  AppWindow,
  Boxes,
  Briefcase,
  Cloud,
  Code2,
  Coffee,
  Container,
  Database,
  FileCode,
  GitBranch,
  Github,
  Globe,
  GraduationCap,
  Hash,
  KanbanSquare,
  Layers,
  Linkedin,
  ListChecks,
  type LucideIcon,
  Mail,
  Megaphone,
  MessageSquare,
  NotebookPen,
  Palette,
  PenTool,
  Plug,
  Rocket,
  Server,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Triangle,
  Twitter,
  Workflow,
  Zap,
} from "lucide-react";

/**
 * Maps icon name strings (from content/data.ts) to lucide-react components.
 * Adding a new icon? Import it above and add it to this map.
 */
export const iconMap: Record<string, LucideIcon> = {
  AppWindow,
  Atom,
  Boxes,
  Briefcase,
  Cloud,
  Code2,
  Coffee,
  Container,
  Database,
  FileCode,
  GitBranch,
  Github,
  Globe,
  GraduationCap,
  Hash,
  KanbanSquare,
  Layers,
  Linkedin,
  ListChecks,
  Mail,
  Megaphone,
  MessageSquare,
  NotebookPen,
  Palette,
  PenTool,
  Plug,
  Rocket,
  Server,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Triangle,
  Twitter,
  Workflow,
  Zap,
};

interface IconProps {
  name: string;
  className?: string;
  "aria-hidden"?: boolean;
}

export function Icon({ name, className, ...rest }: IconProps) {
  const Component = iconMap[name];
  if (!Component) {
    return <Code2 className={className} aria-hidden {...rest} />;
  }
  return <Component className={className} aria-hidden {...rest} />;
}
