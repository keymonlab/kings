'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setMessage('로그인 실패: ' + error.message)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚜️</div>
          <h1 className="text-2xl font-bold">로그인</h1>
          <p className="text-gray-400 mt-1">역사 인물과 대화를 시작하세요</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email" placeholder="이메일" required
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-accent focus:bg-white outline-none transition-colors"
          />
          <input
            type="password" placeholder="비밀번호" required
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-accent focus:bg-white outline-none transition-colors"
          />
          <button type="submit" className="w-full bg-accent text-white py-3 rounded-xl font-medium hover:bg-accent-hover transition-colors shadow-lg">
            로그인
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-red-500 text-center">{message}</p>}

        <p className="mt-6 text-sm text-center text-gray-500">
          계정이 없나요? <a href="/signup" className="text-accent font-medium">회원가입</a>
        </p>
      </div>
    </div>
  )
}