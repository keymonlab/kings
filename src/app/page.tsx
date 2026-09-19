import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: characters } = await supabase.from('characters').select('*')

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">⚜️</div>
          <h1 className="text-4xl font-bold mb-4 text-foreground">역사 인물과 대화하세요</h1>
          <p className="text-gray-500 mb-8 text-lg leading-relaxed">
            세종대왕, 이순신, 장영실...<br />
            역사의 위인들에게 질문하고 기록을 남겨보세요.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/login" className="bg-accent text-white px-8 py-3 rounded-xl font-medium hover:bg-accent-hover transition-colors shadow-lg">
              로그인
            </Link>
            <Link href="/signup" className="border-2 border-accent text-accent px-8 py-3 rounded-xl font-medium hover:bg-accent hover:text-white transition-colors">
              회원가입
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">역사 인물</h1>
          <p className="text-gray-500 mt-1">대화를 시작할 인물을 선택하세요</p>
        </div>

        {characters && characters.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {characters.map((c: any) => (
              <Link key={c.id} href={`/chat/${c.id}`} className="character-card p-6 block group">
                <div className="flex items-start gap-4">
                  <div className="avatar-placeholder shrink-0">
                    {c.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <strong className="text-lg block truncate">{c.name}</strong>
                    <span className="text-xs text-accent font-medium bg-accent/10 px-2 py-0.5 rounded-full">
                      {c.era}
                    </span>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{c.description}</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-accent font-medium group-hover:underline">
                  대화 시작하기 →
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-12">인물이 없습니.</p>
        )}
      </div>
    </div>
  )
}