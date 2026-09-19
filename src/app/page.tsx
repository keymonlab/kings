import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: characters } = await supabase.from('characters').select('*')

  if (!user) {
    return (
      <main className="p-8 max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">역사 인물과 대화하세요</h1>
        <p className="text-gray-600 mb-8">역사의 위인들에게 질문하고 기록을 남겨보세요.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/login" className="bg-black text-white px-6 py-2 rounded">로그인</Link>
          <Link href="/signup" className="border border-black px-6 py-2 rounded">회원가입</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">역사 인물</h1>
        <span className="text-sm text-gray-600">{user.email}</span>
      </div>

      {characters && characters.length > 0 ? (
        <ul className="space-y-3">
          {characters.map((c: any) => (
            <li key={c.id} className="border p-4 rounded flex justify-between items-center">
              <div>
                <strong className="text-lg">{c.name}</strong>
                <span className="text-gray-500 ml-2">{c.era}</span>
                <p className="text-sm mt-1">{c.description}</p>
              </div>
              <Link
                href={`/chat/${c.id}`}
                className="bg-black text-white px-4 py-2 rounded text-sm shrink-0"
              >
                대화하기
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>인물이 없습니다.</p>
      )}
    </main>
  )
}