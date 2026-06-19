import { createClient } from "@supabase/supabase-js";

// TODO: paste your Supabase project URL and publishable/anon key here.
// These values are safe for the frontend — Row Level Security is what protects your data.
const SUPABASE_URL = "https://qslijvyhvyvqlowdxvdy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzbGlqdnlodnl2cWxvd2R4dmR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5ODc2NjcsImV4cCI6MjA2NTU2MzY2N30.HY9E1aK_YE63CKKZ4rbHTul8KCGaT83TnZam54XtqsE";

export type EmailRow = {
  id: string | number;
  gmail_message_id: string;
  gmail_thread_id: string | null;
  sender: string | null;
  subject: string | null;
  snippet: string | null;
  body: string | null;
  created_at: string;
};

export type EmailSummaryRow = {
  id: string | number;
  gmail_message_id: string;
  summary: string | null;
  created_at: string;
};

export type EmailCategoryRow = {
  id: string | number;
  gmail_message_id: string;
  category: string | null;
  created_at: string;
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});

export const isSupabaseConfigured =
  !SUPABASE_URL.includes("YOUR-PROJECT-REF") && !SUPABASE_PUBLISHABLE_KEY.includes("YOUR-PUBLISHABLE");
