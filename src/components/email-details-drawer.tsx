import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CategoryBadge } from "@/components/category-badge";
import { format } from "date-fns";
import type { JoinedEmail } from "@/hooks/use-emails";
import { Sparkles } from "lucide-react";

export function EmailDetailsDrawer({
  email,
  open,
  onOpenChange,
}: {
  email: JoinedEmail | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        {email ? (
          <>
            <SheetHeader className="space-y-3 text-left">
              <CategoryBadge category={email.category} className="w-fit" />
              <SheetTitle className="text-xl leading-snug">
                {email.subject ?? "(no subject)"}
              </SheetTitle>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{email.sender ?? "Unknown sender"}</span>
                <span>{format(new Date(email.created_at), "PPP 'at' p")}</span>
              </div>
            </SheetHeader>

            <div className="mt-6 space-y-6 px-4 pb-8">
              <section className="rounded-lg border border-border bg-muted/40 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Summary
                </div>
                <p className="text-sm leading-relaxed text-foreground">
                  {email.summary ?? <span className="italic text-muted-foreground">Summary unavailable</span>}
                </p>
              </section>

              <section>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email Content
                </div>
                <div className="whitespace-pre-wrap rounded-lg border border-border bg-card p-4 text-sm leading-relaxed text-foreground">
                  {email.body?.trim() || email.snippet?.trim() || (
                    <span className="italic text-muted-foreground">No content available</span>
                  )}
                </div>
              </section>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
