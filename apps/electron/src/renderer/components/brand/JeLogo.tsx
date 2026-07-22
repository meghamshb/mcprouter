import React, { useEffect, useMemo, useState } from "react";
import { useThemeStore } from "@/renderer/stores";
import { cn } from "@/renderer/utils/tailwind-utils";
// Official wordmark from https://www.johnsonelectric.com/static/media/logo.0661c1b0.svg
import jeLogoSvg from "../../../../public/images/brand/je-logo.svg";

type JeLogoProps = {
  className?: string;
  /** light = charcoal wordmark (JE site default); dark = white wordmark on dark UI */
  variant?: "light" | "dark" | "auto";
  title?: string;
};

/**
 * Johnson Electric official logo (orange mark + JOHNSON ELECTRIC wordmark).
 */
export const JeLogo: React.FC<JeLogoProps> = ({
  className = "h-8 w-auto",
  variant = "auto",
  title = "Johnson Electric",
}) => {
  const theme = useThemeStore((s) => s.theme);
  const [systemDark, setSystemDark] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false,
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setSystemDark(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const isDark =
    variant === "dark" ||
    (variant === "auto" &&
      (theme === "dark" || (theme === "system" && systemDark)));

  const markup = useMemo(() => {
    // Official fills: text #231f20, accent #f58220 — invert text only for dark UI
    let svg = isDark
      ? String(jeLogoSvg).replace(/#231f20/gi, "#ffffff")
      : String(jeLogoSvg);
    // Also rewrite CSS class fills (logo uses .cls-1 / .cls-2)
    if (isDark) {
      svg = svg
        .replace(/\.cls-1\{fill:#231f20;?\}/gi, ".cls-1{fill:#ffffff;}")
        .replace(/fill:#231f20/gi, "fill:#ffffff");
    }
    return svg.replace(
      "<svg ",
      `<svg role="img" aria-label="${title}" style="height:100%;width:auto;display:block;" `,
    );
  }, [isDark, title]);

  return (
    <span
      className={cn("inline-flex items-center shrink-0", className)}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
};

export default JeLogo;
