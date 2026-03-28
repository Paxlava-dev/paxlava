# Paxlava Project Memory

## Stack
- Next.js 14 App Router, TypeScript, Tailwind CSS, Firebase (Auth + Firestore + Storage), NextAuth v4

## Architecture
- Firebase client SDK: `src/lib/firebase/client.ts`
- Firebase Admin SDK: `src/lib/firebase/admin.ts`
- Auth: NextAuth with Firebase credentials provider (client gets idToken → NextAuth verifies server-side)
- 3 roles: `buyer`, `seller`, `admin`

## Key Paths
- Home page: `src/app/page.tsx` → `src/components/home/HomeClient.tsx`
- Seller dashboard: `/dashboard/seller` → `SellerDashboardShell`
- Buyer dashboard: `/dashboard/buyer` → `BuyerDashboardShell`
- Admin dashboard: `/dashboard/admin` → `AdminDashboardShell`
- Messages: `/messages` → `MessagesShell`
- Discover: `/discover` → `DiscoverResults` + `SearchFilters`
- Project detail: `/projects/[id]`

## API Routes
- `GET/POST /api/projects` — list (active only) + create (seller only, status=pending_review)
- `GET/PATCH/DELETE /api/projects/[id]`
- `GET/POST /api/messages`
- `GET/POST /api/orders`
- `GET /api/seller/stats`
- `GET /api/users/me`, `PATCH /api/users/me`
- `GET/POST /api/admin/projects` — admin: list by status, approve/reject
- `GET /api/admin/stats` — admin platform overview

## Firestore Rules
- File: `firebase/firestore.rules`
- Indexes: `firebase/firestore.indexes.json`

## Design System
- Colors: `cream` (#FAF8F3), `amber` (#E8A838), `teal` (#23A094), `cobalt`, `coral`, `lav`
- Font: Plus Jakarta Sans (via Next.js font)
- Shadow: `shadow-hard` (3px 4px 0 #000), `shadow-hard-lg`
- Border radius: `rounded-pill` (100px)
- Gumroad-inspired: bold borders, grid layout, black outlines

## Firebase Config
- Project ID: `paxlava-6dbfb`
- Auth domain: `paxlava-6dbfb.firebaseapp.com`
- .env.local has real credentials (Firebase + Admin SDK)

## Contact Filter
- Blocks phone numbers, social handles, Telegram/WhatsApp links in messages
- `src/lib/contact-filter.ts`

## Deployment
- DNS: GoDaddy with CNAME www → paxlava.netlify.app
- Netlify recommended for deploy
- Firestore + Storage rules deployed via Firebase CLI

## Issues Fixed (session 1)
- Created `GET/POST /api/projects/route.ts` (was missing, broke useProjects hook + ListProjectForm)
- Created `HomeClient` component (was missing, broke home page build)
- Fixed `useThreads` hook: was querying all threads without WHERE clause (fails with Firestore security rules in prod); now uses two separate listeners (buyerId + sellerId)
- Created admin dashboard: `/dashboard/admin`, `AdminDashboardShell`, `/api/admin/projects`, `/api/admin/stats`
- Fixed Navbar: admin role now redirects to `/dashboard/admin`
- Fixed SellerDashboardShell: "New listing" button `onClick` was empty `() => {}`; now calls `setTab('new')`
- Added Firestore indexes for price/rating sorts and category+hasDemo combo
- POST /api/projects: changed `status: 'active'` to `status: 'pending_review'` (correct review flow)
- Build passes cleanly: 0 TS errors, full Next.js build succeeds
