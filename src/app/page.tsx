import { supabase } from '@/utils/supabase'

export default async function Home() {
  const { data: characters } = await supabase
    .from('characters')
    .select('*')

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">역사 인물</h1>
      {characters && characters.length > 0 ? (
        <ul className="space-y-2">
          {characters.map((c: any) => (
            <li key={c.id}>
              <strong>{c.name}</strong> — {c.era} · {c.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>인물이 없습니다. Supabase 연결을 확인하세요.</p>
      )}
    </main>
  )
}