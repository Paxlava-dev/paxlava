/**
 * Firestore collection references & typed converters.
 * Import from here instead of writing collection paths manually.
 */
import {
  collection,
  doc,
  type CollectionReference,
  type DocumentReference,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db } from './client'
import type { User, Project, Order, Message, Thread, Review } from '@/types'

// ─── Generic converter factory ─────────────────────────────────
function makeConverter<T extends { id?: string }>(): FirestoreDataConverter<T> {
  return {
    toFirestore(data: T) {
      const { id: _id, ...rest } = data as T & { id?: string }
      return rest
    },
    fromFirestore(snap: QueryDocumentSnapshot): T {
      return { id: snap.id, ...snap.data() } as T
    },
  }
}

// ─── Typed collection refs ──────────────────────────────────────
export const usersCol = collection(db, 'users').withConverter(
  makeConverter<User>()
) as CollectionReference<User>

export const projectsCol = collection(db, 'projects').withConverter(
  makeConverter<Project>()
) as CollectionReference<Project>

export const ordersCol = collection(db, 'orders').withConverter(
  makeConverter<Order>()
) as CollectionReference<Order>

export const reviewsCol = collection(db, 'reviews').withConverter(
  makeConverter<Review>()
) as CollectionReference<Review>

// ─── Nested collections ────────────────────────────────────────
export const threadsCol = collection(db, 'threads').withConverter(
  makeConverter<Thread>()
) as CollectionReference<Thread>

export function messagesCol(threadId: string) {
  return collection(db, 'threads', threadId, 'messages').withConverter(
    makeConverter<Message>()
  ) as CollectionReference<Message>
}

// ─── Document refs ─────────────────────────────────────────────
export const userDoc = (uid: string): DocumentReference<User> =>
  doc(usersCol, uid)

export const projectDoc = (id: string): DocumentReference<Project> =>
  doc(projectsCol, id)

export const orderDoc = (id: string): DocumentReference<Order> =>
  doc(ordersCol, id)

export const threadDoc = (id: string): DocumentReference<Thread> =>
  doc(threadsCol, id)
