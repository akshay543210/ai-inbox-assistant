import { Card, CardContent } from "@/components/ui/card";
import { CATEGORIES, type CategoryKey } from "@/lib/categories";
import type { JoinedEmail } from "@/hooks/use-emails";
import { Mail } from "lucide-react";

const FEATURED: CategoryKey[] = ["job", "newsletter", "notification"];

export function StatsCards({ emails }: { emails: JoinedEmail[] }) {
  const counts: Record<string, number> = {};
  for (const e of emails) counts[e.category.key] = (counts[e.category.key] ?? 0) + 1;

  const cards = [
    { key: "all", label: "Total Emails", count: emails.length, Icon: Mail, color: "text-primary" },
    ...FEATURED.map((k) => {
      const meta = CATEGORIES.find((c) => c.key === k)!;
      return { key: k, label: `Total ${meta.plural}`, count: counts[k] ?? 0, Icon: meta.icon, color: "" };
    }),
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.key} className="border-border/60 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-muted p-2.5">
              <c.Icon className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{c.label}</div>
              <div className="mt-0.5 text-2xl font-semibold tabular-nums text-foreground">{c.count}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
