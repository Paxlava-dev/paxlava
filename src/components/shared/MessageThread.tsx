'use client'
import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useMessages, sendMessage } from '@/hooks/useMessages'
import { timeAgo } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import type { Thread } from '@/types'

interface MessageThreadProps {
  thread: Thread
}

export function MessageThread({ thread }: MessageThreadProps) {
  const { data: session } = useSession()
  const { messages, loading } = useMessages(thread.id || null)
  const [text, setText]       = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef             = useRef<HTMLDivElement>(null)

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!text.trim() || sending) return
    setSending(true)
    try {
      const res = await sendMessage({ threadId: thread.id, text })
      if (res.ok) {
        setText('')
        if (res.data.blocked) {
          // Blocked message feedback is shown via the message list (message comes back as blocked)
        }
      }
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Thread header */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b-2 border-black bg-white shrink-0">
        <div className="w-9 h-9 rounded-full border-2 border-black bg-amber flex items-center justify-center font-black text-sm">
          {thread.sellerName.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <div className="font-bold text-sm">@{thread.sellerId === session?.user.id ? thread.buyerName : thread.sellerName}</div>
          <a href={`/projects/${thread.projectId}`} className="text-xs text-teal hover:underline font-semibold">
            {thread.projectTitle} ↗
          </a>
        </div>
        <a
          href={`/projects/${thread.projectId}`}
          className="ml-auto px-3 py-1.5 border-2 border-black rounded-pill text-xs font-bold hover:bg-black hover:text-white transition-colors"
        >
          View project
        </a>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3 bg-cream">
        {loading && (
          <div className="text-center text-sm text-gray-400 py-8">Loading messages…</div>
        )}
        {messages.map(msg => {
          const isOwn = msg.senderId === session?.user.id
          if (msg.blocked) {
            return (
              <div key={msg.id} className="self-center max-w-[80%] bg-yellow border-2 border-black rounded-xl px-4 py-2.5 text-xs font-semibold text-center">
                ⚠️ A message was blocked — it contained contact information. Keep all communication within Paxlava.
              </div>
            )
          }
          return (
            <div key={msg.id} className={`flex flex-col gap-1 ${isOwn ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[65%] px-4 py-2.5 rounded-2xl border-2 border-black text-sm leading-relaxed ${
                isOwn
                  ? 'bg-black text-white rounded-br-sm'
                  : 'bg-white rounded-bl-sm'
              }`}>
                {msg.text}
              </div>
              <span className="text-[10px] text-gray-400 px-1">
                {timeAgo(msg.createdAt)}
              </span>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2.5 px-4 py-3 border-t-2 border-black bg-white shrink-0">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Type a message… (contact info will be blocked)"
          className="flex-1 border-2 border-black rounded-pill px-4 py-2.5 bg-cream text-sm focus:outline-none focus:bg-white transition-colors"
        />
        <Button
          size="sm"
          onClick={handleSend}
          loading={sending}
          disabled={!text.trim()}
          className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
        >
          →
        </Button>
      </div>
    </div>
  )
}
