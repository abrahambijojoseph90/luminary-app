# Luminary — Shape the Leader Within

A premium, dark-themed leadership training platform built with Next.js 14. Trainees progress through modules, watch their Leadership DNA radar map grow in real time, and track skill development across 6 leadership dimensions.

---

## What's Inside

- **10 Ministry Leadership Modules** across 3 phases (Foundation → Growth → Mastery)
- **Leadership DNA Radar Map** — a live hexagonal skill web that morphs as you complete modules
- **Scroll-to-unlock** completion — you must engage with content before marking it done
- **Progress tracking** — circular progress ring, phase breakdown, skill bars
- **Auth** — register and sign in with email and password
- **Fully responsive** — sidebar on desktop, bottom nav on mobile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom CSS variables |
| Database | PostgreSQL via [Neon](https://neon.tech) |
| ORM | Prisma 5 |
| Auth | NextAuth.js v4 (credentials) |
| Hosting | Vercel (recommended) |

---

## Local Setup (Step by Step)

### Step 1 — Clone the repo

```bash
git clone https://github.com/abrahambijojoseph90/luminary-app.git
cd luminary-app
npm install
```

---

### Step 2 — Create a Neon database

1. Go to [neon.tech](https://neon.tech) and sign in (or create a free account)
2. Click **New Project** — name it `luminary`
3. Once created, click **Connect** and copy the **Connection string** — it looks like:
   ```
   postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

---

### Step 3 — Set up your environment variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then open `.env` and fill in your values:

```env
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
NEXTAUTH_SECRET="any-long-random-string-you-make-up"
NEXTAUTH_URL="http://localhost:3000"
```

> **NEXTAUTH_SECRET** — type any random string of letters and numbers (e.g. `luminary-secret-abc123xyz`). It encrypts user sessions.

---

### Step 4 — Push the database schema

This creates all the tables in your Neon database:

```bash
npx prisma db push
```

You should see:
```
✔ Your database is now in sync with your Prisma schema.
```

---

### Step 5 — Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- You will be redirected to `/login`
- Click **Create Account** to register your first user
- Sign in and explore the dashboard

---

## Deploying to Vercel

### Step 1 — Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New → Project**
3. Find `luminary-app` in your GitHub repos and click **Import**

### Step 2 — Add environment variables

Before clicking Deploy, scroll down to **Environment Variables** and add:

| Name | Value |
|---|---|
| `DATABASE_URL` | Your Neon connection string |
| `NEXTAUTH_SECRET` | Any long random string |
| `NEXTAUTH_URL` | `https://your-app-name.vercel.app` |

> For `NEXTAUTH_URL` — deploy once first to get your Vercel URL, then update this variable and redeploy.

### Step 3 — Deploy

Click **Deploy**. Vercel will build and go live automatically. Every future `git push` to `main` will redeploy.

---

## Project Structure

```
luminary-app/
├── app/
│   ├── layout.tsx              # Root layout + session provider
│   ├── page.tsx                # Redirects to /dashboard or /login
│   ├── providers.tsx           # NextAuth SessionProvider wrapper
│   ├── globals.css             # Global styles, CSS variables, fonts
│   ├── login/page.tsx          # Register + sign in form
│   ├── dashboard/page.tsx      # Main dashboard (stats, radar, next module CTA)
│   ├── modules/page.tsx        # All modules by phase
│   ├── modules/[id]/page.tsx   # Individual module viewer
│   ├── progress/page.tsx       # Progress ring, radar, skill bars
│   └── api/
│       ├── auth/[...nextauth]/ # NextAuth handler
│       ├── register/           # POST — create new user account
│       └── progress/[moduleId] # POST — mark complete / DELETE — unmark
├── components/
│   ├── Navigation.tsx          # Sidebar (desktop) + bottom bar (mobile)
│   ├── RadarMap.tsx            # SVG DNA skill radar map
│   ├── SkillBar.tsx            # Horizontal skill progress bars
│   ├── ModuleCard.tsx          # Module card for the modules list
│   └── ModuleViewer.tsx        # Full module reader with scroll-unlock + completion
├── lib/
│   ├── auth.ts                 # NextAuth config (credentials provider)
│   ├── prisma.ts               # Prisma client singleton
│   └── modules-data.ts         # All 10 modules + skill computation logic
└── prisma/
    └── schema.prisma           # Database schema (User, UserProgress, NextAuth tables)
```

---

## The 10 Modules

| Phase | # | Title | Type |
|---|---|---|---|
| Foundation | 1 | The Heart of a Servant Leader | Article |
| Foundation | 2 | Biblical Vision Casting | Video |
| Foundation | 3 | Pastoral Communication | Article |
| Growth | 4 | Leading Through Crisis | Video |
| Growth | 5 | Building a Ministry Team | Article |
| Growth | 6 | Spiritual Disciplines for Leaders | Article |
| Mastery | 7 | Conflict Resolution in the Church | Video |
| Mastery | 8 | Financial Stewardship in Ministry | Article |
| Mastery | 9 | Mentoring & Discipleship | Video |
| Mastery | 10 | Community Outreach Strategy | Article |

---

## Leadership DNA Skills

The radar map tracks 6 skill dimensions. Each module awards points to specific skills.

| Skill | Colour |
|---|---|
| Vision | Blue |
| Servanthood | Gold |
| Communication | Green |
| Wisdom | Purple |
| Resilience | Orange |
| Discipleship | Cyan |

---

## Replacing Placeholder Videos

Video modules currently use a placeholder YouTube URL. To use real videos:

1. Open `lib/modules-data.ts`
2. Find the module by ID (modules 2, 4, 7, and 9 are video type)
3. Replace the `videoUrl` with a real YouTube embed URL:
   ```
   videoUrl: "https://www.youtube.com/embed/YOUR_VIDEO_ID"
   ```

---

## Adding or Editing Modules

All module content lives in `lib/modules-data.ts` — no database changes needed.

- **Edit content** — update the `content` array inside any module (each item has `heading` and `body`)
- **Add a module** — append a new object to the `MODULES` array following the same structure, and add its ID to the correct phase in `PHASES`
- **Change skill weighting** — update the `skills` object on each module to adjust how much XP each skill earns

---

## Roadmap

| Phase | Feature |
|---|---|
| Phase 2 | AI Reflection Journal — Claude reads your reflections and gives personalised feedback |
| Phase 3 | Tension Board — anonymous shared wall of leadership struggles, voted on by the cohort |
| Phase 4 | Verdict Room — timed scenario-based capstone challenges with peer review |
| Phase 5 | Trainer God View — live constellation map of all trainees |
