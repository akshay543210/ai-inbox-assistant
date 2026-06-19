# AI Email Organizer

An AI-powered email management system that automatically fetches emails from Gmail, generates summaries, classifies them into categories, stores them in Supabase, and displays them in a clean dashboard.

## Features

- 📧 Gmail Integration — automatic fetching via n8n + Gmail API
- 🤖 AI Summaries via Google Gemini
- 🏷️ AI Categorization (Job, Newsletter, Finance, Shopping, Notification, Social, Other)
- 📊 Dashboard with search, filters, and stats
- ☁️ Supabase backend with RLS

---

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, TanStack Start (Lovable)
- **Backend:** Supabase (PostgreSQL, Auth, RLS)
- **Automation:** n8n
- **AI:** Google Gemini API
- **Email:** Gmail API

---

## 1. System Architecture

### Overview

The system automatically fetches emails from Gmail, processes them using AI, stores the results in Supabase, and displays them in a dashboard.

### Architecture Flow

```text
Gmail Inbox
    ↓
Gmail API
    ↓
n8n Workflow
    ↓
Gemini AI
    ↓
Supabase
    ↓
Lovable Dashboard
```

### Components

**Gmail API** — reads incoming emails and retrieves sender, subject, and metadata.

**n8n** — automation layer that:
- Detects new emails
- Fetches email details
- Sends content to Gemini
- Saves results into Supabase

**Gemini AI** — performs email summarization and categorization.

**Supabase** — stores emails, summaries, and categories.

**Lovable Frontend** — displays email list, categories, AI summaries, and dashboard statistics.

---

## 2. Database Schema

### `emails`

```text
id
gmail_message_id
gmail_thread_id
sender
subject
snippet
created_at
```

Purpose: stores email information fetched from Gmail.

### `email_summaries`

```text
id
gmail_message_id
summary
created_at
```

Purpose: stores AI-generated summaries.

### `email_categories`

```text
id
gmail_message_id
category
created_at
```

Purpose: stores AI-generated categories.

**Supported categories:** Job, Newsletter, Finance, Shopping, Notification, Social, Other

### `email_dashboard` (view)

A joined view combining the three tables above on `gmail_message_id`. This is the primary data source for the dashboard.

---

## 3. AI Design

### Email Summarization

When a new email arrives:
1. n8n sends the subject, sender, and snippet to Gemini.
2. Gemini generates a concise summary.
3. The summary is stored in Supabase.

**Input:** Subject, Sender, Email snippet
**Output:** 3-point summary

### Email Categorization

After summarization, Gemini classifies the email into one of:
Job, Newsletter, Finance, Shopping, Notification, Social, Other.

The category is stored in `email_categories`.

### AI Workflow

```text
New Email
     ↓
Gemini Summary
     ↓
Save Summary
     ↓
Gemini Classification
     ↓
Save Category
```

### Source Attribution

Each summary and category record is linked to its source email using `gmail_message_id`. The dashboard joins on this key via the `email_dashboard` view.

---

## Current Limitations

Not yet implemented (planned for future iterations):

- AI Chat Agent
- Vector Search
- pgvector Embeddings
- NVIDIA NIM Integration
- Thread-Level Summarization
- Newsletter Deduplication

---

## Setup

### 1. Configure Supabase

In `src/integrations/supabase/client.ts`, set:
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY` (anon key)

Run in the Supabase SQL editor to allow the dashboard to read the view:

```sql
GRANT SELECT ON public.email_dashboard TO authenticated;
```

### 2. Configure n8n

- Connect Gmail OAuth credentials
- Add Gemini API key
- Point Supabase nodes at your project

### 3. Run

```bash
npm install
npm run dev
```

---

## Security

- Gmail authentication via OAuth (no passwords stored)
- Supabase Row Level Security enabled
- API keys kept in n8n credentials / env vars

---

## Author

**Akshay Muthyala** — Community Builder · Full Stack Developer · AI & Automation Enthusiast · Founder of PropFirm Knowledge

## License

MIT
