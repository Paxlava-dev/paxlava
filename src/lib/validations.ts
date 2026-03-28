import { z } from 'zod'

// ─── Auth ───────────────────────────────────────────────────────
export const loginSchema = z.object({
  email:    z.string().email('Invalid email'),
  password: z.string().min(6, 'At least 6 characters'),
})

export const signupSchema = z.object({
  displayName: z.string().min(2, 'At least 2 characters').max(50),
  email:       z.string().email('Invalid email'),
  password:    z.string().min(6, 'At least 6 characters'),
  role:        z.enum(['buyer', 'seller']),
})

export type LoginInput  = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>

// ─── Project ────────────────────────────────────────────────────
export const projectSchema = z.object({
  title: z.string()
    .min(5,  'Title must be at least 5 characters')
    .max(100, 'Title must be under 100 characters'),
  description: z.string()
    .min(20,  'Description must be at least 20 characters')
    .max(500,  'Keep description under 500 characters'),
  longDescription: z.string().max(5000).optional(),
  category: z.enum([
    'e-commerce', 'saas', 'mobile-app', 'ai-automation',
    'landing-page', 'script-api', 'game', 'security', 'other',
  ]),
  price: z.number()
    .min(1,   'Minimum price is $1')
    .max(50000, 'Maximum price is $50,000'),
  techStack: z.array(z.string().max(30)).min(1, 'Add at least one technology').max(20),
  demoURL:   z.string().url('Must be a valid URL').optional().or(z.literal('')),
  features:  z.array(z.string().max(200)).min(1, 'Add at least one feature').max(20),
  tags:      z.array(z.string().max(30)).max(10).optional(),
})

export type ProjectInput = z.infer<typeof projectSchema>

// ─── Message ────────────────────────────────────────────────────
export const messageSchema = z.object({
  text: z.string()
    .min(1,   'Message cannot be empty')
    .max(2000, 'Message too long (max 2000 characters)'),
})

export type MessageInput = z.infer<typeof messageSchema>

// ─── Review ─────────────────────────────────────────────────────
export const reviewSchema = z.object({
  rating:  z.number().min(1).max(5),
  comment: z.string().min(10, 'At least 10 characters').max(1000),
})

export type ReviewInput = z.infer<typeof reviewSchema>

// ─── Profile ────────────────────────────────────────────────────
export const profileSchema = z.object({
  displayName: z.string().min(2).max(50),
  bio:         z.string().max(500).optional(),
  website:     z.string().url().optional().or(z.literal('')),
  location:    z.string().max(100).optional(),
})

export type ProfileInput = z.infer<typeof profileSchema>
