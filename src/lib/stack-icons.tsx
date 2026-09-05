import {
  Atom,
  Boxes,
  Cloud,
  Code2,
  Container,
  Database,
  FileCode,
  Github,
  KanbanSquare,
  Layers,
  Linkedin,
  ListChecks,
  type LucideIcon,
  Mail,
  MessageSquare,
  NotebookPen,
  Palette,
  PenTool,
  Plug,
  Rocket,
  Server,
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
  Atom,
  Boxes,
  Cloud,
  Code2,
  Container,
  Database,
  FileCode,
  Github,
  KanbanSquare,
  Layers,
  Linkedin,
  ListChecks,
  Mail,
  MessageSquare,
  NotebookPen,
  Palette,
  PenTool,
  Plug,
  Rocket,
  Server,
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
