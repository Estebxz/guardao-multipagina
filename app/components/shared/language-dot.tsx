const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7e018",
  Python: "#3475a8",
  Go: "#00ADD8",
  Java: "#ec2025",
  PHP: "#4F5D95",
  Ruby: "#701516",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Rust: "#dea584",
  Dart: "#00B4AB",
  Astro: "#ff5d01",
  markdown: "#083fa1",
  docs: "#ffffff",
};

function normalizeLanguage(language: string) {
  return language.trim();
}

interface LanguageDotProps {
  language?: string | null;
  className?: string;
}

export function LanguageDot({ language, className }: LanguageDotProps) {
  if (!language) return null;

  const key = normalizeLanguage(language);
  const color = LANGUAGE_COLORS[key] ?? "#94a3b8";

  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <span className="text-muted-foreground text-sm">{language}</span>
    </span>
  );
}