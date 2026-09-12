# 🎒 Gadget Board — 4D Pocket Collaborative Idea Board

A fun, interactive and collaborative idea board inspired by the world of Doraemon.

**Gadget Board** allows users to post their wishes or ideas, explore ideas shared by others, upvote them, comment on them, and mark ideas as granted using futuristic gadgets.

---

## ✨ Features

- 💡 Create and submit wish/idea cards
- 🔍 Search and filter wishes
- ⬆️ Upvote interesting ideas
- 💬 Comment on wishes
- 🎁 Grant wishes with futuristic gadgets
- 🎉 Celebration animation when a wish is granted
- 👤 Multiple user personas
- 📱 Responsive design for desktop and mobile
- ⚡ Smooth animations and interactive UI
- 🔄 Real-time data support with Supabase
- 🗄️ Local in-memory fallback when Supabase is not configured
- 🛡️ Input validation using Zod
- 🚀 Next.js App Router architecture

---

## 🛠️ Tech Stack

### Frontend

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- Canvas Confetti

### Backend

- Next.js API Route Handlers
- Supabase
- PostgreSQL
- Supabase Realtime

### Validation

- Zod

### Development Tools

- Node.js
- npm
- Git & GitHub
- Vercel

---

## 📁 Project Structure

```text
gadget-board/
│
├── app/
│   ├── api/
│   │   ├── comments/
│   │   └── wishes/
│   │       └── [id]/
│   │           ├── grant/
│   │           ├── upvote/
│   │           └── route.ts
│   │
│   ├── login/
│   │   └── page.tsx
│   │
│   ├── signup/
│   │   └── page.tsx
│   │
│   ├── wish/
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── CategoryFilter.tsx
│   ├── DoraemonIcons.tsx
│   ├── DoraemonMascot.tsx
│   ├── EditWishModal.tsx
│   ├── EmptyState.tsx
│   ├── Footer.tsx
│   ├── GrantedCelebration.tsx
│   ├── HeroBanner.tsx
│   ├── LoadingSkeleton.tsx
│   ├── Navbar.tsx
│   ├── NewWishModal.tsx
│   ├── SearchAndSort.tsx
│   ├── UpvoteButton.tsx
│   ├── WishCard.tsx
│   ├── WishDetailModal.tsx
│   └── WishGrid.tsx
│
├── lib/
│   ├── context.tsx
│   ├── seed-data.ts
│   ├── serverStore.ts
│   ├── supabaseClient.ts
│   ├── types.ts
│   └── validation.ts
│
├── supabase/
│   └── seed.sql
│
├── next.config.mjs
├── package.json
├── package-lock.json
├── tailwind.config.ts
├── tsconfig.json
└── test-api.mjs