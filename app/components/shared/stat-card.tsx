import { Card, CardContent } from "../ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
}

export function StatCard({ label, value, subtitle }: StatCardProps) {
  return (
    <Card className="bg-background">
      <CardContent className="p-6">
        <p className="text-muted-foreground text-xs tracking-wider uppercase">
          {label}
        </p>
        <p className="mt-2 font-semibold text-3xl leading-none">{value}</p>
        {subtitle && (
          <p className="mt-2 text-muted-foreground text-sm">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
