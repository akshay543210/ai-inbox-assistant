import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useThreadSummaries, type ThreadSummaryRow } from "@/hooks/use-thread-summaries";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { format } from "date-fns";
import { Search, ChevronLeft, ChevronRight, MessagesSquare, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/thread-summaries")({
  component: ThreadSummariesPage,
});

const PAGE_SIZE = 15;

function ThreadSummariesPage() {
  const { data, isLoading, error } = useThreadSummaries();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<ThreadSummaryRow | null>(null);

  const filtered = useMemo(() => {
    const list = data ?? [];
    const term = q.trim().toLowerCase();
    if (!term) return list;
    return list.filter((t) =>
      [t.gmail_thread_id, t.summary].filter(Boolean).some((v) => v!.toLowerCase().includes(term)),
    );
  }, [data, q]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const slice = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Thread Summaries</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          AI-generated summaries grouped by Gmail thread.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(0);
          }}
          placeholder="Search thread summaries…"
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          Failed to load thread summaries: {(error as Error).message}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={MessagesSquare}
          title="No thread summaries"
          description="Thread summaries will appear here as they are generated."
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[220px]">Thread ID</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead className="w-[140px]">Created</TableHead>
                  <TableHead className="w-[140px]">Updated</TableHead>
                  <TableHead className="w-[100px] text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slice.map((t) => (
                  <TableRow key={String(t.id)} className="cursor-pointer" onClick={() => setSelected(t)}>
                    <TableCell className="font-mono text-xs">{t.gmail_thread_id}</TableCell>
                    <TableCell className="max-w-[480px] truncate text-muted-foreground">
                      {t.summary ?? <span className="italic">No summary</span>}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground tabular-nums">
                      {format(new Date(t.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground tabular-nums">
                      {t.updated_at ? format(new Date(t.updated_at), "MMM d, yyyy") : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelected(t); }}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {filtered.length} thread{filtered.length === 1 ? "" : "s"} · Page {safePage + 1} of {pageCount}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={safePage === 0}>
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))} disabled={safePage >= pageCount - 1}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          {selected ? (
            <>
              <SheetHeader className="text-left">
                <SheetTitle className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> Thread Summary
                </SheetTitle>
                <div className="text-xs font-mono text-muted-foreground">{selected.gmail_thread_id}</div>
              </SheetHeader>
              <div className="mt-6 space-y-4 px-4 pb-8">
                <div className="rounded-lg border bg-muted/40 p-4 text-sm leading-relaxed whitespace-pre-wrap">
                  {selected.summary ?? "No summary available"}
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div>
                    <div className="font-semibold uppercase tracking-wider">Created</div>
                    <div className="mt-1">{format(new Date(selected.created_at), "PPP p")}</div>
                  </div>
                  <div>
                    <div className="font-semibold uppercase tracking-wider">Updated</div>
                    <div className="mt-1">
                      {selected.updated_at ? format(new Date(selected.updated_at), "PPP p") : "—"}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
