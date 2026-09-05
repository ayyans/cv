"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Wraps the app in next-themes. Defaults to dark mode; persists to localStorage.
 * `attribute="class"` puts the .dark class on <html>, which @custom-variant picks up.
 * `disableTransitionOnChange` avoids color flashes when toggling.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      themes={["light", "dark"]}
    >
      {children}
    </NextThemesProvider>
  );
}
