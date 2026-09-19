import { supabase } from '@/utils/supabase'
import Link from 'next/link'

export default async function Home() {
  const { data: { user } } = await supabase.auth.getUser()
  const { data: characters } = await supabase.from('characters').select('*')

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">역사 인물</h1>
        {user ? (
          <span className="text-sm text-gray-600">{user.email}</span>
        ) : (
          <Link href="/login" className="text-sm underline">로그인</Link>
        )}
      </div>

      {characters && characters.length > 0 ? (
        <ul className="space-y-3">
          {characters.map((c: any) => (
            <li key={c.id} className="border p-4 rounded">
              <strong className="text-lg">{c.name}</strong>
              <span className="text-gray-500 ml-2">{c.era}</span>
              <p className="text-sm mt-1">{c.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>인물이 없습니다.</p>
      )}
    </main>
  )
}