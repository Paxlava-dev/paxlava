import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format } from 'date-fns'
import type { Timestamp } from 'firebase/firestore'

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format cents → "$349.00" */
export function formatPrice(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style:    'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

/** Convert dollars → cents */
export const dollarsToCents = (dollars: number) => Math.round(dollars * 100)

/** Convert cents → dollars */
export const centsToDollars = (cents: number) => cents / 100

/** Platform fee (10%) */
export const PLATFORM_FEE_PCT = 0.10
export const platformFee = (cents: number) => Math.round(cents * PLATFORM_FEE_PCT)
export const sellerReceives = (cents: number) => cents - platformFee(cents)

/** Convert Firestore Timestamp or Date → JS Date */
export function toDate(ts: Timestamp | Date | undefined): Date | null {
  if (!ts) return null
  if (ts instanceof Date) return ts
  return (ts as Timestamp).toDate()
}

/** "3 days ago" */
export function timeAgo(ts: Timestamp | Date | undefined): string {
  const d = toDate(ts)
  if (!d) return ''
  return formatDistanceToNow(d, { addSuffix: true })
}

/** "Mar 24, 2025" */
export function formatDate(ts: Timestamp | Date | undefined): string {
  const d = toDate(ts)
  if (!d) return ''
  return format(d, 'MMM d, yyyy')
}

/** Truncate text */
export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max - 3) + '…' : str
}

/** Slugify a string */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/** Category display names */
export const CATEGORY_LABELS: Record<string, string> = {
  'e-commerce':    'E-Commerce',
  'saas':          'SaaS / Dashboard',
  'mobile-app':    'Mobile App',
  'ai-automation': 'AI / Automation',
  'landing-page':  'Landing Page',
  'script-api':    'Script / API',
  'game':          'Game',
  'security':      'Security',
  'other':         'Other',
}

/** Star rating helpers */
export const starLabel = (rating: number) =>
  rating >= 4.8 ? 'Excellent' :
  rating >= 4.0 ? 'Very Good' :
  rating >= 3.0 ? 'Good' : 'Fair'
