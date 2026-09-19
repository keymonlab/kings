import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ChatInput from '../ChatInput'

export default async function Chat({ params }: { params: Promise<{ characterId: string }> }) {
  const { characterId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div className="p-8 text-center text-gray-400">로그인이 필요합니다.</div>
  }

  const { data: character } = await supabase
    .from('characters')
    .select('*')
    .eq('id', characterId)
    .single()

  if (!character) {
    notFound()
  }

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
    .order('created_at', { ascending: true })

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4 flex items-center gap-4">
        <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
          ←
        </Link>
        <div className="flex items-center gap-3">
          <div className="avatar-placeholder w-10 h-10 text-base">{character.name[0]}</div>
          <div>
            <h1 className="font-bold text-lg">{character.name}</h1>
            <p className="text-xs text-gray-400">{character.era} · {character.description}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages && messages.length > 0 ? (
            messages.map((m: any) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-3 text-sm ${m.role === 'user' ? 'bubble-user' : 'bubble-other'}`}>
                  <p>{m.content}</p>
                  <span className="text-[0.65rem] opacity-50 mt-1.5 block">
                    {new Date(m.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 py-12">첫 질문을 입력하세요</p>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-card p-4">
        <div className="max-w-2xl mx-auto">
          <ChatInput conversationId={conversation!.id} />
        </div>
      </div>
    </div>
  )
}