import { createFileRoute, Link } from "@tanstack/react-router";
import { useEmails } from "@/hooks/use-emails";
import { StatsCards } from "@/components/stats-cards";
import { EmailTable } from "@/components/email-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { data, isLoading, error } = useEmails();

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          AI-organized overview of your inbox.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          Failed to load emails: {(error as Error).message}
        </div>
      ) : (
        <>
          <StatsCards emails={data ?? []} />

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Recent emails</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/emails">
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <EmailTable emails={(data ?? []).slice(0, 8)} showSearch={false} />
          </section>
        </>
      )}
    </div>
  );
}
