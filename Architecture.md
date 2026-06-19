# Architecture & Design Document

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

**Gmail API** — used to:
- Read incoming emails
- Retrieve sender information
- Retrieve subject and email metadata

**n8n** — automation layer. Responsibilities:
- Detect new emails
- Fetch email details
- Send email content to Gemini
- Save results into Supabase

**Gemini AI** — used for:
- Email summarization
- Email categorization

**Supabase** — stores:
- Emails
- Email summaries
- Email categories

**Lovable Frontend** — displays:
- Email list
- Categories
- AI summaries
- Dashboard statistics

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

A joined view combining the three tables above on `gmail_message_id`. Used as the primary data source for the dashboard.

---

## 3. AI Design

### Email Summarization

When a new email arrives:
1. n8n sends the email subject, sender, and snippet to Gemini.
2. Gemini generates a concise summary.
3. The summary is stored in Supabase.

**Input:** Subject, Sender, Email snippet
**Output:** 3-point summary

### Email Categorization

After summarization, Gemini classifies the email into one category:
Job, Newsletter, Finance, Shopping, Notification, Social, Other.

The category is stored in the `email_categories` table.

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

Each summary and category record is linked to its source email using `gmail_message_id`. This allows the dashboard to associate AI results with the original email.

---

## 4. Current Limitations

Not yet implemented (planned for future iterations):

- AI Chat Agent
- Vector Search
- pgvector Embeddings
- NVIDIA NIM Integration
- Thread-Level Summarization
- Newsletter Deduplication
