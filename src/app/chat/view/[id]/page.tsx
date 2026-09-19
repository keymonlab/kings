import { supabase } from '@/utils/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ViewChat({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <p className="p-8">로그인이 필요합니다.</p>
  }

  const { data: conversation } = await supabase
    .from('conversations')
    .select('*, characters(name, era)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!conversation) {
    notFound()
  }

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true })

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/history" className="text-sm underline">← 기록으로</Link>
        <h1 className="text-2xl font-bold mt-2">{(conversation as any).characters?.name || conversation.title}</h1>
        <p className="text-gray-500">{(conversation as any).characters?.era}</p>
      </div>

      <div className="space-y-3">
        {messages && messages.length > 0 ? (
          messages.map((m: any) => (
            <div key={m.id} className={`p-3 rounded ${m.role === 'user' ? 'bg-blue-50 ml-8' : 'bg-gray-50 mr-8'}`}>
              <p>{m.content}</p>
              <span className="text-xs text-gray-400 mt-1 block">
                {new Date(m.created_at).toLocaleTimeString('ko-KR')}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">메시지가 없습니다.</p>
        )}
      </div>
    </main>
  )
}