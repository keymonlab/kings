import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function History() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div className="p-8 text-center text-gray-400">로그인이 필요합니다.</div>
  }

  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, title, created_at, character_id, characters(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">내 기록</h1>

      {conversations && conversations.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {conversations.map((c: any) => (
            <Link
              key={c.id}
              href={`/chat/view/${c.id}`}
              className="character-card p-5 block"
            >
              <div className="flex items-center gap-3">
                <div className="avatar-placeholder w-10 h-10 text-sm shrink-0">
                  {((c as any).characters?.name || c.title)[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <strong className="block truncate">{(c as any).characters?.name || c.title}</strong>
                  <span className="text-xs text-gray-400">
                    {new Date(c.created_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <span className="text-gray-400 text-sm">→</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">📋</div>
          <p>아직 대화 기록이 없습니다.</p>
        </div>
      )}
    </div>
  )
}