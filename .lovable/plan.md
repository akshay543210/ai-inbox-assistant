
# AI Email Organizer — Build Plan

A Gmail-like dashboard reading `emails`, `email_summaries`, and `email_categories` from your existing Supabase project, behind email/password login.

## What you'll get

- **Login screen** (`/auth`) — email + password sign in / sign up using your Supabase Auth.
- **Protected app shell** with a left sidebar: Dashboard, All Emails, Jobs, Newsletters, Finance, Shopping, Notifications, Social, Other. Collapsible on mobile.
- **Dashboard** (`/`) — 4 stat cards (Total Emails, Jobs, Newsletters, Notifications) + recent emails preview.
- **Email list** (`/emails`, and `/emails/category/$category`) — searchable, sortable, paginated table with columns: Category badge, Sender, Subject, Summary (truncated), Received Date.
- **Email detail drawer** — right-side `Sheet` showing Subject, Sender, Category badge, Date, AI Summary, full body / snippet fallback.
- **Empty states** — "No emails found" and "Summary unavailable" where appropriate.

## Connecting your existing Supabase

Since you're bringing your own project (not Lovable Cloud), I'll need two values added as secrets so the frontend can talk to it:

- `VITE_SUPABASE_URL` — e.g. `https://xxxx.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY` — your project's anon/publishable key (safe for frontend; RLS still applies)

After the plan is approved I'll prompt you for these via the secrets form. You'll also need to confirm RLS policies on your three tables allow `SELECT` for authenticated users (and that `gmail_message_id` is the join key).

## Data fetching

A single TanStack Query call per view, joining via `gmail_message_id` client-side:

```ts
// emails + latest summary + latest category
supabase.from('emails')
  .select('*, email_summaries(summary, created_at), email_categories(category, created_at)')
  .order('created_at', { ascending: false })
```

Then in JS: pick the most recent `email_summaries[*]` and most recent `email_categories[*]` per email (your choice). Category filter applied via `.in('gmail_message_id', …)` from a categories subquery, or client-side filter on the joined result for the first iteration.

Stats use `count: 'exact', head: true` queries against `email_categories` filtered by category, plus total from `emails`.

## File layout

```text
src/
  integrations/supabase/client.ts        # createClient from env
  routes/
    __root.tsx                            # QueryClient + auth listener
    auth.tsx                              # login / signup
    _authenticated/
      route.tsx                           # gate -> /auth if no session
      index.tsx                           # Dashboard
      emails.index.tsx                    # All emails
      emails.category.$category.tsx       # Filtered list
  components/
    app-sidebar.tsx
    stats-cards.tsx
    email-table.tsx
    category-badge.tsx
    email-details-drawer.tsx
    empty-state.tsx
  hooks/
    use-emails.ts                         # joined query + helpers
    use-email-stats.ts
    use-auth.ts
```

## Design

Clean white SaaS look: shadcn `Card`, `Table`, `Sheet`, `Badge`, `Input`, `Button`, `Sidebar`. Category badges use semantic color tokens added to `src/styles.css` (one hue per category, both light/dark). Inter for body, slightly tighter tracking on headings. Subtle border + shadow on cards, generous padding, sticky table header.

## Out of scope (ask if you want them)

- Writing/sending emails, marking read/unread, archiving.
- n8n webhook setup.
- Role-based access (everyone signed in sees all rows; that's what your schema implies).
