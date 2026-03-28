'use client'
import { useState } from 'react'
import { useThreads } from '@/hooks/useMessages'
import { MessageThread } from './MessageThread'
import { timeAgo } from '@/lib/utils'
import type { Thread } from '@/types'

interface MessagesShellProps {
  userId:   string
  userName: string
}

export function MessagesShell({ userId, userName }: MessagesShellProps) {
  const { threads, loading } = useThreads(userId)
  const [activeThread, setActiveThread] = useState<Thread | null>(null)

  return (
    <div className="flex border-t-2 border-black" style={{ height: 'calc(100vh - 60px)' }}>
      {/* Thread list */}
      <div className="w-[290px] border-r-2 border-black flex flex-col bg-white shrink-0 overflow-hidden">
        <div className="px-4 py-3.5 border-b-2 border-black bg-cream font-black text-base">
          Messages
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="p-4 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-2.5 animate-pulse">
                  <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-2.5 bg-gray-200 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && threads.length === 0 && (
            <div className="text-center py-12 text-gray-400 px-4">
              <p className="text-3xl mb-2">💬</p>
              <p className="text-sm font-semibold">No messages yet</p>
              <p className="text-xs mt-1">Find a project and message the seller to get started.</p>
            </div>
          )}
          {threads.map(t => {
            const isActive = activeThread?.id === t.id
            const unread   = t.unreadCount?.[userId] ?? 0
            const otherName = t.buyerId === userId ? t.sellerName : t.buyerName
            return (
              <button
                key={t.id}
                onClick={() => setActiveThread(t)}
                className={`w-full flex items-center gap-2.5 px-4 py-3.5 border-b border-black/8 text-left transition-colors ${
                  isActive ? 'bg-cream border-l-[3px] border-l-black' : 'hover:bg-cream/60'
                }`}
              >
                <div className="w-9 h-9 rounded-full border-2 border-black bg-amber flex items-center justify-center font-black text-xs shrink-0">
                  {otherName.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm truncate">@{otherName}</span>
                    <span className="text-[10px] text-gray-400 shrink-0 ml-1">{timeAgo(t.lastMessageAt)}</span>
                  </div>
                  <div className="text-xs text-gray-500 truncate mt-0.5 flex items-center gap-1">
                    <span className="truncate">{t.lastMessage}</span>
                    {unread > 0 && (
                      <span className="ml-auto shrink-0 w-4 h-4 bg-black text-white rounded-full text-[9px] font-black flex items-center justify-center">
                        {unread}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-400 truncate mt-0.5">{t.projectTitle}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-hidden">
        {activeThread ? (
          <MessageThread thread={activeThread} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-cream text-center px-8">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-2xl font-black mb-2">Your messages</h2>
            <p className="text-gray-500 max-w-xs">
              Select a conversation from the left, or start a new one by messaging a seller from any project page.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
