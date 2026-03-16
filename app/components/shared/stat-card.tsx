import { IconName } from "@type/ui";
import { Card, CardContent } from "@ui/card";
import { UseIcon } from "@hooks/use-icons";
import { cn } from "@lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: Extract<IconName, "code" | "clock" | "grid">;
  accent: "blue" | "amber" | "green";
}

const accentStyles = {
  blue: { wrap: "bg-blue-500/10  text-blue-400" },
  amber: { wrap: "bg-amber-500/10 text-amber-400" },
  green: { wrap: "bg-green-500/10 text-green-400" },
};

export function StatCard({
  label,
  value,
  subtitle,
  icon,
  accent,
}: StatCardProps) {
  const styles = accentStyles[accent];

  return (
    <Card className="bg-background">
      <CardContent className="flex items-center gap-4 p-5">
        <div className={cn("rounded-lg p-2.5 shrink-0", styles.wrap)}>
          <UseIcon name={icon} className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground text-xs tracking-wider uppercase">
            {label}
          </p>
          <p className="mt-1 font-semibold leading-none text-xl">{value}</p>
          {subtitle && (
            <p className="mt-1 text-muted-foreground text-xs">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
