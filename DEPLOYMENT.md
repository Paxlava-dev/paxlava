# Paxlava — Deployment Guide

## Architecture Overview

```
paxlava.com (Netlify / Vercel)
    │
    ├── Next.js 14 App Router (frontend + API routes)
    │       ├── /app/page.tsx              → Home
    │       ├── /app/discover/             → Marketplace
    │       ├── /app/projects/[id]/        → Project detail
    │       ├── /app/auth/login|signup     → Auth pages
    │       ├── /app/dashboard/seller|buyer→ Dashboards
    │       ├── /app/messages/             → Inbox
    │       └── /app/api/                  → REST API
    │
    ├── Firebase (Google Cloud)
    │       ├── Authentication  → Email + Google + GitHub OAuth
    │       ├── Firestore       → Database (users, projects, orders, messages)
    │       └── Storage         → Images & screenshots
    │
    └── Netlify / Vercel
            └── Auto-deploy from GitHub on push to main
```

---

## Step 1 — Firebase setup

### 1.1 Create project
1. Go to https://console.firebase.google.com
2. Click **Add project** → name it `paxlava`
3. Enable Google Analytics (optional)

### 1.2 Enable Authentication
1. Firebase Console → **Authentication** → **Get started**
2. Enable these providers:
   - **Email/Password** ✅
   - **Google** ✅ (add your domain to Authorised domains)
   - **GitHub** ✅ (need GitHub OAuth app — see below)

### 1.3 GitHub OAuth App
1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
   - Homepage URL: `https://paxlava.com`
   - Callback URL: `https://paxlava.com/api/auth/callback/github`
2. Copy Client ID and Secret → paste into Firebase GitHub provider settings

### 1.4 Create Firestore database
1. Firebase Console → **Firestore Database** → **Create database**
2. Choose **Production mode** (rules are already in `firebase/firestore.rules`)
3. Choose region: `europe-west1` (closest to Azerbaijan)

### 1.5 Enable Storage
1. Firebase Console → **Storage** → **Get started**
2. Use production mode

### 1.6 Get Firebase config
1. Firebase Console → Project Settings → Your apps → **Add app** → Web
2. Copy the config object — you'll need it for `.env.local`

### 1.7 Get Admin SDK credentials
1. Firebase Console → Project Settings → **Service accounts**
2. Click **Generate new private key** → download JSON
3. Extract `project_id`, `client_email`, `private_key` → add to `.env.local`

---

## Step 2 — Local setup

```bash
# Clone and install
git clone https://github.com/YOUR_USERNAME/paxlava.git
cd paxlava
npm install

# Copy env template
cp .env.local.example .env.local

# Fill in ALL values in .env.local (see comments in that file)
# Then run locally
npm run dev
```

Open http://localhost:3000

---

## Step 3 — Deploy Firebase rules & indexes

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Link to your project
firebase use --add   # select your paxlava project

# Deploy Firestore rules + indexes
firebase deploy --only firestore

# Deploy Storage rules
firebase deploy --only storage
```

---

## Step 4 — Deploy to Netlify (recommended)

### Option A: Netlify (your current setup with paxlava.com)

1. Push code to GitHub
2. Go to https://app.netlify.com → **Add new site** → **Import from Git**
3. Select your repo
4. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
5. Add all environment variables from `.env.local` to Netlify:
   - Site settings → Environment variables → Add all vars
6. Enable **Next.js Runtime** in Netlify (auto-detected)
7. Your GoDaddy DNS already has `CNAME www → paxlava.netlify.app` ✅

### Option B: Vercel (easiest for Next.js)

```bash
npm install -g vercel
vercel

# Follow prompts, then add env vars:
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# ... repeat for all vars

vercel --prod
```

Then add custom domain `paxlava.com` in Vercel dashboard.

---

## Step 5 — GoDaddy DNS (for paxlava.com)

Your current DNS records need one update for Netlify:

| Type  | Name | Value                    |
|-------|------|--------------------------|
| A     | @    | `75.2.60.5` (Netlify IP) |
| CNAME | www  | `paxlava.netlify.app`    |

For Vercel, change the A record to: `76.76.21.21`

---

## Step 6 — Post-deployment checklist

- [ ] Test sign up (email + Google + GitHub)
- [ ] Test creating a project listing (as seller)
- [ ] Test browsing and searching discover page
- [ ] Test sending a message (verify contact-info blocking works)
- [ ] Test seller dashboard stats load
- [ ] Test buyer dashboard shows purchases
- [ ] Check Firestore console — users/projects collections created
- [ ] Check Firebase Storage — images upload correctly
- [ ] Add your domain to Firebase Auth **Authorised domains**
       Firebase Console → Auth → Settings → Authorized domains → Add `paxlava.com`

---

## Environment Variables Reference

| Variable | Where to get it |
|----------|----------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console → Project Settings → Your apps |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Same |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Same |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Same |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Same |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Same |
| `FIREBASE_ADMIN_PROJECT_ID` | Firebase Console → Service Accounts JSON |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Same |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Same (wrap in quotes in .env.local) |
| `NEXTAUTH_URL` | Your production URL, e.g. `https://paxlava.com` |
| `NEXTAUTH_SECRET` | Run: `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | Google Cloud Console → OAuth 2.0 credentials |
| `GOOGLE_CLIENT_SECRET` | Same |
| `GITHUB_CLIENT_ID` | GitHub → Developer Settings → OAuth Apps |
| `GITHUB_CLIENT_SECRET` | Same |

---

## Database Structure

```
Firestore
├── users/{uid}
│     uid, email, displayName, photoURL, role, verified,
│     bio, website, location, stats{}, createdAt, updatedAt
│
├── projects/{projectId}
│     sellerId, sellerName, title, description, category,
│     price (cents), status, techStack[], screenshots[],
│     demoURL, hasDemo, features[], tags[], views, purchases,
│     rating, reviewCount, createdAt, updatedAt
│
├── orders/{orderId}
│     projectId, buyerId, sellerId, amount, platformFee,
│     sellerReceives, status, stripePaymentIntentId,
│     createdAt, updatedAt
│
├── threads/{threadId}
│     projectId, buyerId, sellerId, lastMessage,
│     lastMessageAt, unreadCount{}, createdAt
│     └── messages/{messageId}
│           senderId, text, blocked, createdAt
│
└── reviews/{reviewId}
      projectId, orderId, buyerId, rating, comment, createdAt
```

---

## Adding Stripe payments (next step)

1. Create Stripe account at https://stripe.com
2. Add to `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
3. Create `/api/payments/create-intent` route
4. Add Stripe Elements to checkout page
5. Wire webhook to update order status → `in_escrow` → `completed`
