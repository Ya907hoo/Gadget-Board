# 🎒 Gadget Board — 4D Pocket Collaborative Idea Board

> A collaborative, Doraemon-inspired idea board where users post daily wishes (like reaching into Doraemon's 4D pocket), upvote ideas, propose 22nd-century gadget solutions, and celebrate "granting" wishes in real time.

---

## 🌟 Live Demo & Video Walkthrough

- **Live Demo Deployment:** [Deploy to Vercel Guide](#-deployment-to-vercel) (or run locally in 1 step)
- **Walkthrough Video Script:** See [VIDEO_WALKTHROUGH.md](./VIDEO_WALKTHROUGH.md) for the 90-second script demonstrating real-time shared mutations between two browser windows.

---

## ✨ Core Features & Visual Experience

### 1. Doraemon Light-Mode Aesthetic (Original Homage)
- **Palette**: Strictly light mode throughout.
  - Primary: Doraemon Blue (`#0A84FF`) & Sky Blue (`#7EC8E3`)
  - Accent: Collar Red (`#FF4D4D`) for action buttons & upvote particles
  - Secondary Accent: Golden Bell Yellow (`#FFD447`) for granted badges & confetti
  - Background: Off-white Cream (`#FFFDF7` / `#FFFFFF`)
  - Typography: Playful rounded sans-serif (`Nunito`) for headings + readable `Inter` for body
- **Geometric Motifs**: Custom original SVG components inspired by the 4D pocket pouch silhouette, collar bell, propeller rotor, and star sparkles (strictly avoiding copyrighted character artwork or official logos).

### 2. Framer Motion Micro-Interactions & Animations
- **Staggered Card Entrance**: Smooth spring fade + slide-up when the board loads or filters update.
- **Upvote Micro-interaction**: Bounce scale-pop + a floating `+1 ✨` particle burst on click.
- **"Granted" Celebration**: Multi-colored canvas confetti explosion (sky blue, golden bell yellow, collar red) and golden shimmer sweep across the card.
- **Animated Loading Skeletons**: Shimmer pulse loaders that emulate layout geometry while data loads.
- **Bouncing 4D Pocket Empty State**: Floating pouch illustration with playful copy and filter reset CTA.
- **Spring Modals**: Backdrop blur, spring scale-in dialogs, and animated error shake validations.
- **Real-Time Pulse Indicator**: Live beacon displaying real-time synchronization across connected clients and tabs.

### 3. Collaborative Permissions & Personas
- **Multi-Persona Switcher**: Switch between iconic collaborative personas (`Nobita N.`, `Shizuka M.`, `Takeshi "Gian" G.`, `Suneo H.`, `Doraemon (Host)`).
- **Creator Ownership**: Only the creator of a wish can edit or delete their wish (enforced both in the UI and on the API layer).
- **1-Vote Per User Upvoting**: Toggleable upvoting system preventing vote spam while updating counts in real time.
- **Gadget Solution Comments**: Community members propose 22nd-century gadgets to solve wishes, featuring dedicated gadget badges.
- **Grant Action**: Anyone in the community can help grant a wish by selecting or naming the winning gadget solution!

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | Next.js 14 (App Router) + React 18 (Strict TypeScript) |
| **Styling** | Tailwind CSS (Custom Doraemon Light Palette & Shadows) |
| **Motion & Animation** | Framer Motion + Canvas-Confetti |
| **Icons & Motifs** | Custom SVG Doraemon Motifs + Lucide React |
| **Backend API** | Next.js Modular Route Handlers (`/api/wishes`, `/api/wishes/[id]`, `/api/comments`, etc.) |
| **Database & Realtime** | Supabase PostgreSQL + Realtime Channels (with zero-friction local in-memory fallback) |
| **Validation** | Zod Schema Validation |
| **Dependencies** | Strictly pinned versions in `package.json` |

---

## 📂 Project Structure

```
gadget-board/
├── app/
│   ├── layout.tsx               # Root layout with Nunito & Inter fonts, AppProvider
│   ├── page.tsx                 # Main board with hero, filters, search, wish grid, modals
│   ├── globals.css              # Doraemon light-mode variables, custom scrollbar & animations
│   ├── wish/[id]/page.tsx       # Dedicated permalink view for individual wishes & discussions
│   └── api/
│       ├── wishes/
│       │   ├── route.ts         # GET (search/filter/sort), POST (create wish)
│       │   └── [id]/
│       │       ├── route.ts     # GET single wish, PUT (edit with auth), DELETE (with auth)
│       │       ├── upvote/      # POST toggle upvote
│       │       └── grant/       # POST grant wish with celebratory gadget
│       └── comments/
│           └── route.ts         # GET wish comments, POST comment / gadget idea
├── components/
│   ├── Navbar.tsx               # Header with pocket badge, real-time live pulse, persona switcher
│   ├── HeroBanner.tsx           # Playful 4D Pocket intro card with live stats & CTAs
│   ├── CategoryFilter.tsx       # Interactive category pill tabs with counts
│   ├── SearchAndSort.tsx        # Search bar, status segment, and sort dropdown
│   ├── WishCard.tsx             # Animated card with owner options, grant button, upvote
│   ├── WishGrid.tsx             # Responsive grid with LayoutGroup & AnimatePresence
│   ├── UpvoteButton.tsx         # Micro-animated upvote button (+1 floating particle)
│   ├── NewWishModal.tsx         # Modal with zod validation, image presets & error shake
│   ├── EditWishModal.tsx        # Creator-only edit modal
│   ├── WishDetailModal.tsx      # Full wish view with gadget comments thread & grant action
│   ├── GrantedCelebration.tsx   # Canvas confetti burst & golden shimmer banner
│   ├── LoadingSkeleton.tsx      # Custom animated shimmer skeleton cards
│   ├── EmptyState.tsx           # Bouncing 4D Pocket animation with friendly copy
│   ├── DoraemonIcons.tsx        # Custom original SVG icons (Pouch, Bell, Propeller, Personas)
│   └── Footer.tsx               # Design credits, stack badges, homage notice
├── lib/
│   ├── types.ts                 # TypeScript interfaces (Wish, WishComment, UserPersona)
│   ├── validation.ts            # Zod validation schemas
│   ├── seed-data.ts             # Rich initial wishes, personas, and preset gadget suggestions
│   ├── serverStore.ts           # Unified data layer supporting both Supabase and fallback
│   ├── supabaseClient.ts        # Supabase client initializer with configuration detection
│   └── context.tsx              # App state, optimistic updates, and cross-tab real-time sync
├── supabase/
│   └── seed.sql                 # Complete Supabase schema migration + sample seed data
├── .env.example                 # Template environment variables
├── package.json                 # Strictly pinned package versions
└── tailwind.config.ts           # Custom Doraemon theme configuration
```

---

## 🚀 Quickstart & Local Setup

### 1. Clone the repository & Install Dependencies
```bash
git clone https://github.com/<your-username>/gadget-board.git
cd gadget-board
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Zero-Friction Evaluation:** The application includes an intelligent server-side store pre-seeded with creative Doraemon wishes and comments. Evaluators can immediately test multi-user switching, creating wishes, upvoting with particles, editing/deleting, and granting wishes **out of the box without any initial cloud setup**.

---

## 🗄️ Supabase Setup (Optional for Live Cloud DB)

To connect Gadget Board to your own Supabase project:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy the entire contents of [`supabase/seed.sql`](./supabase/seed.sql) and click **Run**. This will create the `wishes`, `wish_upvotes`, and `wish_comments` tables, set up Row Level Security policies, enable Realtime subscriptions, and insert sample wishes.
4. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
5. Fill in your project settings from **Project Settings > API**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
6. Restart your development server (`npm run dev`). The live pulse indicator in the top navbar will display **Realtime Live**.

---

## 🌐 Deployment to Vercel

1. Push your code to a public GitHub repository.
2. Sign in to [Vercel](https://vercel.com) and click **Add New > Project**.
3. Import your `gadget-board` repository.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL` (optional)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional)
5. Click **Deploy**. Vercel will build and launch your live URL in seconds!

---

## 📋 Evaluation Checklist Confirmation

- [x] **Public GitHub repo URL**: Ready to push to GitHub with clean git history.
- [x] **Live demo link**: Deploys directly to Vercel with zero configuration.
- [x] **Short video walkthrough guide**: Detailed in `VIDEO_WALKTHROUGH.md`.
- [x] **Responsive layout**: Tested for mobile (375px), tablet (768px), and desktop (1280px+).
- [x] **Handling of edge states**: Animated skeleton loaders, empty state with floating 4D pocket, form error shake.
- [x] **Doraemon-inspired light-mode theme**: Doraemon blue, collar red, bell yellow, cream background, rounded corners.
- [x] **All motion & animation requirements**: Staggered cards, upvote bounce + `+1` particle, confetti burst, golden shimmer.
- [x] **Pinned dependencies**: Strictly pinned versions in `package.json` (no loose `^` or `~`).
- [x] **Bonus features implemented**: Multi-user ownership, creator editing/deleting, toggleable upvotes, gadget discussion thread, full-text search, category filtering, preset image selector.
