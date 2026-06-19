import { createFileRoute } from "@tanstack/react-router";
import { useEmails } from "@/hooks/use-emails";
import { EmailTable } from "@/components/email-table";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/emails/")({
  component: EmailsPage,
});

function EmailsPage() {
  const { data, isLoading, error } = useEmails();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">All Emails</h1>
        <p className="mt-1 text-sm text-muted-foreground">Browse, search, and read AI summaries.</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          Failed to load emails: {(error as Error).message}
        </div>
      ) : (
        <EmailTable emails={data ?? []} />
      )}
    </div>
  );
}
