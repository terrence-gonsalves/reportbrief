# 📊 ReportBrief

ReportBrief is a lightweight AI-powered micro-SaaS that transforms Salesforce report data into clear, executive-ready summaries.

Upload a Salesforce report (CSV), and ReportBrief generates:

- A concise executive summary
- Key metrics
- Notable trends
- Actionable recommendations

Built for Salesforce admins, RevOps, and operators who need insights without manual analysis.

## ✨ Features

- 🔐 Secure authentication via Supabase
- 📁 Upload Salesforce CSV reports
- 🤖 AI-generated summaries (structured JSON)
- 👤 Per-user data isolation (Row Level Security)
- ⚡ Fast, minimal, no-friction UI
- 🧱 Built as a scalable Micro-SaaS

## 🧰 Tech Stack

<p align="left">
  <img src="https://nextjs.org/favicon.ico?favicon.d29c4393.ico" alt="Next.js" width="32" />
  <img src="https://supabase.com/favicon/favicon-32x32.png" alt="Supabase" width="32" />
  <img src="https://openai.com/favicon.ico" alt="OpenAI" width="32" />
  <img src="https://tailwindcss.com/favicons/favicon-32x32.png" alt="Tailwind CSS" width="32" />
</p>

| Layer | Technology |
|------|------------|
| Frontend | Next.js (Pages Router) |
| Backend API | Next.js API Routes |
| Authentication | Supabase Auth |
| Database | Supabase (PostgreSQL + RLS) |
| AI | OpenAI API (stubbed for MVP) |
| Styling | Tailwind CSS |
| Hosting (planned) | Vercel |

## 🏗️ Architecture Overview

```text
  Browser
    ↓
  Next.js Pages (UI)
    ↓
  Next.js API Routes
    ↓
  Supabase Auth (JWT)
    ↓
  Supabase Postgres (RLS enforced)
    ↓
  OpenAI API (summarization)
```

## 🔐 Authentication & Security

- Uses Supabase Auth (email / magic link)
- Each user is assigned a unique user_id
- All database tables enforce Row Level Security
- Users can only access their own reports and summaries
- No service-role keys are exposed to the client

## 🚀 Getting Started (Local Development)

1. Clone the repository

```bash
  git clone https://github.com/YOUR_USERNAME/reportbrief.git
  cd reportbrief
```

2. Install dependencies

```bash
  npm install
```

3. Create environment variables

Create a .env.local file in the project root:

`NEXT_PUBLIC_SUPABASE_URL=your_supabase_url`
`NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key`
`OPENAI_API_KEY=your_openai_key_optional`

4. Run the development server

```bash
  npm run dev
```

## 🧪 AI Behavior (MVP Phase)

During early development:

- AI responses are stubbed if no OpenAI key is present
- This allows full UI + data-flow testing at $0 cost

The OpenAI integration can be enabled later without refactoring.

### 📌 Roadmap

- Secure authentication
- CSV upload & parsing
- AI summary stub
- OpenAI production prompts
- Dashboard UX polish
- Stripe subscriptions
- Team / org support
- Salesforce direct API integration

## 🧠 Product Vision

ReportBrief aims to be:

>  “The fastest way to understand what your Salesforce reports are actually saying.”

Long-term plans include:

- Multiple report types
- Scheduled summaries
- Slack / email delivery
- Org-wide insights

## 📄 License

[GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/)

## 🙌 Author

[@terrence-gonsalves](https://www.github.com/terrence-gonsalves)