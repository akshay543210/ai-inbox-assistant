import { useQuery } from "@tanstack/react-query";
import { supabase, type EmailRow } from "@/integrations/supabase/client";
import { categoryFromRaw, type CategoryMeta } from "@/lib/categories";

export type JoinedEmail = EmailRow & {
  summary: string | null;
  rawCategory: string | null;
  category: CategoryMeta;
};

type DashboardRow = {
  id?: string | number;
  gmail_message_id: string;
  gmail_thread_id?: string | null;
  sender?: string | null;
  subject?: string | null;
  snippet?: string | null;
  body?: string | null;
  created_at: string;
  summary?: string | null;
  category?: string | null;
};

export function useEmails() {
  return useQuery({
    queryKey: ["emails", "dashboard-view"],
    queryFn: async (): Promise<JoinedEmail[]> => {
      const { data, error } = await supabase
        .from("email_dashboard")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      const rows = (data ?? []) as unknown as DashboardRow[];
      return rows.map((r) => ({
        id: r.id ?? r.gmail_message_id,
        gmail_message_id: r.gmail_message_id,
        gmail_thread_id: r.gmail_thread_id ?? null,
        sender: r.sender ?? null,
        subject: r.subject ?? null,
        snippet: r.snippet ?? null,
        body: r.body ?? null,
        created_at: r.created_at,
        summary: r.summary ?? null,
        rawCategory: r.category ?? null,
        category: categoryFromRaw(r.category),
      }));
    },
  });
}
