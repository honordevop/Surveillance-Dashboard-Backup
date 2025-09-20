# Pipeline Surveillance AI Dashboard

A **Next.js** web application for **New Guard Security and Consultancy Services** that combines an **Incident Dashboard** and an **AI-powered Chatbot** to enhance pipeline and oil & gas installation surveillance reporting.

---

## 🚀 Features

- **Incident Dashboard**

  - Admin page for monthly surveillance data input.
  - Track illegal connections, refineries, oil/gas leaks, arrests, confiscations, aversions, and burnt seized assets.
  - Interactive visualizations with charts, tables, and maps.
  - Filter incident reports by **month** and **year**.

- **AI Chatbot**

  - Built with **OpenAI GPT-4o-mini** and **pgvector embeddings**.
  - Pretrained on daily surveillance data (incident logs).
  - Visitors can ask natural language questions about incidents and security trends.
  - Provides detailed responses with context from stored reports.

- **Tech Stack**
  - **Frontend**: Next.js, React, Tailwind CSS
  - **Backend**: Next.js API routes, Prisma ORM
  - **Database**: Supabase (Postgres + pgvector extension)
  - **AI**: OpenAI GPT-4o-mini (chat + embeddings)

---

## 📊 Data Flow

1. **Admin Inputs Data** → Stored in Supabase via Prisma ORM.
2. **Incident Dashboard** → Fetches and visualizes monthly/yearly incidents.
3. **Daily Reports** → Converted to embeddings and stored in pgvector DB.
4. **User Queries Chatbot** → Query embedding + vector search → GPT-4o-mini response.

---

## 🛠️ Setup & Installation

### 1. Clone the Repository

```bash
git clone git@github.com:honordevop/Pipeline-Surveillance-Incidents-Dashoard-and-ChatBot-AI.git
cd pipeline-surveillance-ai-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env.local` file:

```bash
DATABASE_URL="your-supabase-database-url"
OPENAI_API_KEY="your-openai-api-key"
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 4. Run Database Migrations

```bash
npx prisma migrate dev
```

### 5. Start Development Server

```bash
npm run dev
```

---

## 📂 Project Structure

```
/app
  /admin          → Admin dashboard for data input
  /incident       → Incident dashboard with charts & filters
  /api
    /chatbot      → API routes for AI chatbot
    /incident     → API routes for incident data
/prisma
  schema.prisma   → Prisma ORM schema
/components       → Reusable UI components
/lib              → Supabase client, OpenAI helpers, vector search utils
```

---

## 📈 Roadmap

- [ ] Role-based authentication for admin dashboard
- [ ] Interactive map visualization of incidents with coordinates
- [ ] Export monthly report as PDF/Excel
- [ ] Chatbot voice integration (speech-to-text + text-to-speech)
- [ ] Push notifications for new incidents

---

## 📜 License

This project is licensed under to New Guard Security and Consultancy Services.
