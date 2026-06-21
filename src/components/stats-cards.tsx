import { Card, CardContent } from "@/components/ui/card";
import { CATEGORIES, type CategoryKey } from "@/lib/categories";
import type { JoinedEmail } from "@/hooks/use-emails";
import { Mail, Sparkles, MessagesSquare, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const FEATURED: CategoryKey[] = ["job", "newsletter", "finance", "notification", "social"];

export function StatsCards({
  emails,
  threadSummaryCount,
}: {
  emails: JoinedEmail[];
  threadSummaryCount?: number;
}) {
  const counts: Record<string, number> = {};
  for (const e of emails) counts[e.category.key] = (counts[e.category.key] ?? 0) + 1;
  const summaryCount = emails.filter((e) => e.summary).length;
  const lastSync = emails[0]?.created_at
    ? formatDistanceToNow(new Date(emails[0].created_at), { addSuffix: true })
    : "—";

  const cards = [
    { key: "all", label: "Total Emails", count: emails.length, Icon: Mail, isNumber: true },
    ...FEATURED.map((k) => {
      const meta = CATEGORIES.find((c) => c.key === k)!;
      return { key: k, label: meta.plural, count: counts[k] ?? 0, Icon: meta.icon, isNumber: true };
    }),
    { key: "summaries", label: "AI Summaries", count: summaryCount, Icon: Sparkles, isNumber: true },
    {
      key: "threads",
      label: "Thread Summaries",
      count: threadSummaryCount ?? 0,
      Icon: MessagesSquare,
      isNumber: true,
    },
    { key: "sync", label: "Last Sync", count: lastSync, Icon: Clock, isNumber: false },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.key} className="border-border/60 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-muted p-2.5">
              <c.Icon className="h-5 w-5 text-foreground" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{c.label}</div>
              <div
                className={
                  c.isNumber
                    ? "mt-0.5 text-2xl font-semibold tabular-nums text-foreground"
                    : "mt-0.5 text-sm font-medium text-foreground truncate"
                }
              >
                {c.count}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
