# MyFinTrack

A modern, full-featured personal finance web app for tracking income, expenses, budgets, and savings goals. Built with React, TypeScript, and Supabase.

---

## Features

- **Dashboard** — Overview of income, expenses, balance, and quick insights
- **Transactions** — Add, edit, and filter income and expenses with categories
- **Budgets** — Set monthly budgets and track spending by category
- **Savings goals** — Define goals, contribute, and monitor progress
- **Analytics** — Charts and trends for your financial data
- **Settings** — Currency, income defaults, display name, and preferences
- **Authentication** — Secure sign up / sign in with email and strong password rules
- **Theme** — Light and dark mode support

---

## Tech stack

| Area        | Technology                    |
| ----------- | ----------------------------- |
| Frontend    | React 19, TypeScript, Vite    |
| Styling     | Tailwind CSS 4                |
| Routing     | React Router 7                |
| Backend     | Supabase (Auth + PostgreSQL)  |
| Charts      | Recharts                      |
| Icons       | Lucide React                  |

---

## Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **npm** or **yarn**
- A [Supabase](https://supabase.com) project (for auth and database)

---

## Getting started

### 1. Clone and install

```bash
git clone <repository-url>
cd expense-tracker
npm install
```

### 2. Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard, go to **Project Settings → API** and copy:
   - **Project URL**
   - **anon (public) key**
3. Apply the schema: in the SQL Editor, run the contents of `supabase-schema.sql` to create tables and RLS policies.

### 3. Environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Replace with your Supabase project URL and anon key.

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Scripts

| Command        | Description                |
| -------------- | -------------------------- |
| `npm run dev`  | Start dev server (Vite)     |
| `npm run build`| TypeScript check + build   |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint                 |

---

## Project structure

```
expense-tracker/
├── public/           # Static assets (favicon, logos)
├── src/
│   ├── components/   # UI components (auth, dashboard, layout, etc.)
│   ├── contexts/    # Auth and theme context
│   ├── services/    # Supabase and API logic
│   ├── utils/       # Helpers (formatting, input)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── supabase-schema.sql   # Database schema and RLS
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## License

This project is private. All rights reserved.
