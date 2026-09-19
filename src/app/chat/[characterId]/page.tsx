import { supabase } from '@/utils/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ChatInput from '../ChatInput'

export default async function Chat({ params }: { params: Promise<{ characterId: string }> }) {
  const { characterId } = await params
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <p className="p-8">로그인이 필요합니다.</p>
  }

  const { data: character } = await supabase
    .from('characters')
    .select('*')
    .eq('id', characterId)
    .single()

  if (!character) {
    notFound()
  }

  // 대화 찾거나 새로 생성
  let { data: conversation } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', user.id)
    .eq('character_id', characterId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!conversation) {
    const { data: newConv } = await supabase
      .from('conversations')
      .insert({
        user_id: user.id,
        character_id: characterId,
        title: character.name,
      })
      .select('*')
      .single()
    conversation = newConv
  }

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversation!.id)
    .eq('role', 'user')
    .order('created_at', { ascending: true })

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="text-sm underline">← 돌아가기</Link>
        <h1 className="text-2xl font-bold mt-2">{character.name}</h1>
        <p className="text-gray-500">{character.era} · {character.description}</p>
      </div>

      <div className="space-y-3 mb-6">
        {messages && messages.length > 0 ? (
          messages.map((m: any) => (
            <div key={m.id} className="border p-3 rounded bg-gray-50">
              <p>{m.content}</p>
              <span className="text-xs text-gray-400 mt-1 block">
                {new Date(m.created_at).toLocaleTimeString('ko-KR')}
              </span>
            </div>
          ))
       ) : (
          <p className="text-gray-400 text-center">첫 번째 질문을 입력하세요.</p>
        )}
      </div>

      <ChatInput conversationId={conversation!.id} />
    </main>
  )
}