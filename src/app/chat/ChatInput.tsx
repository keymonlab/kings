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
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="질문을 입력하세요..."
        className="border p-2 flex-1 rounded"
        required
        disabled={sending}
      />
      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded"
        disabled={sending}
      >
        전송
      </button>
    </form>
  )
}