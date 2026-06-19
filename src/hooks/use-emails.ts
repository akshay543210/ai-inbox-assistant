import { useQuery } from "@tanstack/react-query";
import { supabase, type EmailRow, type EmailCategoryRow, type EmailSummaryRow } from "@/integrations/supabase/client";
import { categoryFromRaw, type CategoryMeta } from "@/lib/categories";

export type JoinedEmail = EmailRow & {
  summary: string | null;
  rawCategory: string | null;
  category: CategoryMeta;
};

type RawJoined = EmailRow & {
  email_summaries: EmailSummaryRow[] | null;
  email_categories: EmailCategoryRow[] | null;
};

function pickLatest<T extends { created_at: string }>(rows: T[] | null | undefined): T | null {
  if (!rows || rows.length === 0) return null;
  return [...rows].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))[0];
}

export function useEmails() {
  return useQuery({
    queryKey: ["emails"],
    queryFn: async (): Promise<JoinedEmail[]> => {
      const { data, error } = await supabase
        .from("emails")
        .select("*, email_summaries(*), email_categories(*)")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      const rows = (data ?? []) as unknown as RawJoined[];
      return rows.map((r) => {
        const sum = pickLatest(r.email_summaries);
        const cat = pickLatest(r.email_categories);
        return {
          ...r,
          summary: sum?.summary ?? null,
          rawCategory: cat?.category ?? null,
          category: categoryFromRaw(cat?.category),
        };
      });
    },
  });
}
