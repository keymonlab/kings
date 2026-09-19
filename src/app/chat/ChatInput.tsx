'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ChatInput({ conversationId }: { conversationId: string }) {
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setSending(true)
    await supabase.from('messages').insert({
      conversation_id: conversationId,
      role: 'user',
      content: content.trim(),
    })
    setContent('')
    setSending(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="질문을 입력하세요..."
        className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-accent focus:bg-white outline-none transition-colors"
        required
        disabled={sending}
      />
      <button
        type="submit"
        className="bg-accent text-white px-6 py-3 rounded-xl font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
        disabled={sending}
      >
        전송
      </button>
    </form>
  )
}