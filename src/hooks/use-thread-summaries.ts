import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ThreadSummaryRow = {
  id: string | number;
  gmail_thread_id: string;
  summary: string | null;
  created_at: string;
  updated_at?: string | null;
};

export function useThreadSummaries() {
  return useQuery({
    queryKey: ["thread_summaries"],
    queryFn: async (): Promise<ThreadSummaryRow[]> => {
      const { data, error } = await supabase
        .from("thread_summaries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return (data ?? []) as unknown as ThreadSummaryRow[];
    },
  });
}

export function useThreadSummary(threadId: string | null | undefined) {
  return useQuery({
    queryKey: ["thread_summary", threadId],
    enabled: !!threadId,
    queryFn: async (): Promise<ThreadSummaryRow | null> => {
      if (!threadId) return null;
      const { data, error } = await supabase
        .from("thread_summaries")
        .select("*")
        .eq("gmail_thread_id", threadId)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as ThreadSummaryRow) ?? null;
    },
  });
}
