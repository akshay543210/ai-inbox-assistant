import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEmails } from "@/hooks/use-emails";
import { EmailTable } from "@/components/email-table";
import { Skeleton } from "@/components/ui/skeleton";
import { categoryByKey } from "@/lib/categories";
import { useMemo } from "react";

export const Route = createFileRoute("/_authenticated/emails/category/$category")({
  component: CategoryPage,
  beforeLoad: ({ params }) => {
    if (!categoryByKey(params.category)) throw notFound();
  },
});

function CategoryPage() {
  const { category } = Route.useParams();
  const meta = categoryByKey(category)!;
  const { data, isLoading, error } = useEmails();

  const filtered = useMemo(
    () => (data ?? []).filter((e) => e.category.key === meta.key),
    [data, meta.key],
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-muted p-2">
          <meta.icon className="h-5 w-5 text-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{meta.plural}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {isLoading ? "Loading…" : `${filtered.length} email${filtered.length === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          Failed to load emails: {(error as Error).message}
        </div>
      ) : (
        <EmailTable emails={filtered} />
      )}
    </div>
  );
}
