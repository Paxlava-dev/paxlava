import type { Timestamp } from 'firebase/firestore'

// ─── User ───────────────────────────────────────────────────────
export type UserRole = 'buyer' | 'seller' | 'admin'

export interface User {
  id?: string
  uid: string
  email: string
  displayName: string
  photoURL?: string
  role: UserRole
  bio?: string
  website?: string
  location?: string
  verified: boolean
  createdAt: Timestamp | Date
  updatedAt: Timestamp | Date
  // Seller stats (denormalised for performance)
  stats?: {
    totalSales: number
    totalRevenue: number
    totalListings: number
    rating: number
    reviewCount: number
  }
}

// ─── Project ────────────────────────────────────────────────────
export type ProjectCategory =
  | 'e-commerce'
  | 'saas'
  | 'mobile-app'
  | 'ai-automation'
  | 'landing-page'
  | 'script-api'
  | 'game'
  | 'security'
  | 'other'

export type ProjectStatus = 'draft' | 'pending_review' | 'active' | 'paused' | 'rejected'

export interface Project {
  id?: string
  sellerId: string
  sellerName: string
  sellerPhotoURL?: string
  title: string
  description: string
  longDescription?: string
  category: ProjectCategory
  price: number          // USD cents, e.g. 34900 = $349
  currency: 'USD'
  status: ProjectStatus
  techStack: string[]    // ['Next.js', 'Stripe', 'PostgreSQL']
  thumbnailURL?: string
  screenshots: string[]  // Storage URLs
  demoURL?: string
  hasDemo: boolean
  features: string[]     // bullet points of what's included
  tags: string[]
  // Stats (updated via Cloud Functions)
  views: number
  purchases: number
  rating: number
  reviewCount: number
  createdAt: Timestamp | Date
  updatedAt: Timestamp | Date
}

// ─── Order ──────────────────────────────────────────────────────
export type OrderStatus =
  | 'pending'
  | 'in_escrow'
  | 'delivered'
  | 'completed'
  | 'disputed'
  | 'refunded'
  | 'cancelled'

export interface Order {
  id?: string
  projectId: string
  projectTitle: string
  projectThumbnailURL?: string
  buyerId: string
  buyerName: string
  sellerId: string
  sellerName: string
  amount: number          // USD cents
  platformFee: number     // 10% of amount
  sellerReceives: number  // amount - platformFee
  currency: 'USD'
  status: OrderStatus
  // Stripe
  stripePaymentIntentId?: string
  stripeTransferId?: string
  // Delivery
  deliveredAt?: Timestamp | Date
  completedAt?: Timestamp | Date
  createdAt: Timestamp | Date
  updatedAt: Timestamp | Date
}

// ─── Messaging ──────────────────────────────────────────────────
export interface Thread {
  id?: string
  projectId: string
  projectTitle: string
  buyerId: string
  buyerName: string
  buyerPhotoURL?: string
  sellerId: string
  sellerName: string
  sellerPhotoURL?: string
  lastMessage: string
  lastMessageAt: Timestamp | Date
  unreadCount: Record<string, number> // { [userId]: count }
  createdAt: Timestamp | Date
}

export interface Message {
  id?: string
  threadId: string
  senderId: string
  senderName: string
  text: string
  blocked: boolean        // true if contact-info was detected
  blockedReason?: string
  createdAt: Timestamp | Date
}

// ─── Review ─────────────────────────────────────────────────────
export interface Review {
  id?: string
  projectId: string
  orderId: string
  buyerId: string
  buyerName: string
  buyerPhotoURL?: string
  rating: number    // 1–5
  comment: string
  createdAt: Timestamp | Date
}

// ─── UI types ──────────────────────────────────────────────────
export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  perPage: number
  hasMore: boolean
}

export interface ApiError {
  code: string
  message: string
}

export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError }
