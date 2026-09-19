import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function History() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <p className="p-8">로그인이 필요합니다.</p>
  }

  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, title, created_at, character_id, characters(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <Link href="/" className="text-sm underline mb-4 inline-block">← 돌아가기</Link>
      <h1 className="text-2xl font-bold mb-4">내 기록</h1>

      {conversations && conversations.length > 0 ? (
        <ul className="space-y-2">
          {conversations.map((c: any) => (
            <li key={c.id}>
              <Link
                href={`/chat/view/${c.id}`}
                className="block border p-4 rounded hover:bg-gray-50"
              >
                <strong className="text-lg">{(c as any).characters?.name || c.title}</strong>
                <span className="text-gray-500 ml-2 text-sm">
                  {new Date(c.created_at).toLocaleDateString('ko-KR')}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">아직 대화 기록이 없습니다.</p>
      )}
    </main>
  )
}