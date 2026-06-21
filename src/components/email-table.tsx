import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "@/components/category-badge";
import { EmailDetailsDrawer } from "@/components/email-details-drawer";
import { EmptyState } from "@/components/empty-state";
import { format } from "date-fns";
import { Search, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import type { JoinedEmail } from "@/hooks/use-emails";

const PAGE_SIZE = 15;

export function EmailTable({ emails, showSearch = true }: { emails: JoinedEmail[]; showSearch?: boolean }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<JoinedEmail | null>(null);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return emails;
    return emails.filter((e) =>
      [e.sender, e.subject, e.summary, e.snippet]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(term)),
    );
  }, [emails, q]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const slice = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="space-y-4">
      {showSearch ? (
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
            placeholder="Search by sender, subject, or summary…"
            className="pl-9"
          />
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <EmptyState icon={Inbox} title="No emails found" description="Try a different search or category." />
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[140px]">Category</TableHead>
                  <TableHead className="w-[200px]">Sender</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="hidden lg:table-cell">Summary</TableHead>
                  <TableHead className="w-[140px] text-right">Received</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slice.map((e) => (
                  <TableRow
                    key={String(e.id)}
                    onClick={() => setSelected(e)}
                    className="cursor-pointer"
                  >
                    <TableCell>
                      <CategoryBadge category={e.category} />
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate font-medium text-foreground">
                      {e.sender ?? "—"}
                    </TableCell>
                    <TableCell className="max-w-[280px] truncate">{e.subject ?? "(no subject)"}</TableCell>
                    <TableCell className="hidden max-w-[420px] truncate text-muted-foreground lg:table-cell">
                      {e.summary ?? <span className="italic">Summary unavailable</span>}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground tabular-nums">
                      {format(new Date(e.created_at), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {filtered.length} email{filtered.length === 1 ? "" : "s"} · Page {safePage + 1} of {pageCount}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={safePage === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={safePage >= pageCount - 1}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      <EmailDetailsDrawer
        email={selected}
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
      />
    </div>
  );
}
