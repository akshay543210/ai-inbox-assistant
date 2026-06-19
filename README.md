# AI Email Organizer



An AI-powered email management system that automatically fetches emails from Gmail, generates summaries, classifies them into categories, stores them in Supabase, and displays them in a clean dashboard.



## Features



* 📧 Gmail Integration



  * Automatically fetches incoming emails using n8n and Gmail API.

  * Stores email metadata and content in Supabase.



* 🤖 AI Email Summaries



  * Generates concise summaries for each email using Google Gemini AI.



* 🏷️ AI Email Classification



  * Automatically categorizes emails into:



    * Job

    * Newsletter

    * Finance

    * Shopping

    * Notification

    * Social

    * Other



* 📊 Dashboard



  * View all emails in one place.

  * Filter emails by category.

  * Search emails by sender, subject, or summary.

  * View category statistics.



* ☁️ Supabase Backend



  * Stores emails, summaries, and categories.

  * Row Level Security (RLS) enabled.

  * Real-time database support.



---



## Tech Stack



### Frontend



* React

* TypeScript

* Tailwind CSS

* Lovable



### Backend



* Supabase

* PostgreSQL



### Automation



* n8n



### AI



* Google Gemini API



### Email



* Gmail API



---



## Database Structure



### emails



```sql

id

gmail_message_id

gmail_thread_id

sender

subject

snippet

body

created_at

```



### email_summaries



```sql

id

gmail_message_id

summary

created_at

```



### email_categories



```sql

id

gmail_message_id

category

created_at

```



---



## Workflow



```text

Gmail Trigger

      ↓

Get Email Content

      ↓

Save Email to Supabase

      ↓

Generate AI Summary

      ↓

Save Summary

      ↓

Generate AI Category

      ↓

Save Category

      ↓

Display in Dashboard

```



---



## Email Categories



| Category     | Example                             |

| ------------ | ----------------------------------- |

| Job          | Job openings, recruiter emails      |

| Newsletter   | Weekly newsletters, subscriptions   |

| Finance      | Bank statements, payment alerts     |

| Shopping     | Orders, deliveries, receipts        |

| Notification | Account alerts, password changes    |

| Social       | Friend requests, comments, mentions |

| Other        | Uncategorized emails                |



---



## Screenshots



### Dashboard



* Total Emails

* Total Jobs

* Total Newsletters

* Total Notifications

* Category-based filtering

* Email summaries



### Categories



* Jobs

* Newsletters

* Finance

* Shopping

* Notifications

* Social

* Other



---



## Setup



### 1. Clone Repository



```bash

git clone https://github.com/yourusername/ai-email-organizer.git

cd ai-email-organizer

```



### 2. Configure Supabase



Add:



```env

VITE_SUPABASE_URL=YOUR_SUPABASE_URL

VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

```



### 3. Configure Gemini



Add your Gemini API key inside n8n credentials.



### 4. Configure Gmail



Connect Gmail OAuth credentials in n8n.



### 5. Run Project



```bash

npm install

npm run dev

```



---



## Security



* Gmail authentication through OAuth.

* Supabase Row Level Security enabled.

* No Gmail passwords are stored.

* API keys stored securely in environment variables.



---



## Future Improvements



* Gmail label automation

* Bulk email actions

* AI priority scoring

* Daily email digest

* Unsubscribe assistant

* Spam detection

* Email sentiment analysis

* Mobile responsive dashboard



---



## Author



**Akshay Muthyala**



* Community Builder

* Full Stack Developer

* AI & Automation Enthusiast

* Founder of PropFirm Knowledge


---



## License



MIT License



Feel free to use, modify, and contribute to the project. 🚀
