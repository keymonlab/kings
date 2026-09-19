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

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage('로그인 실패: ' + error.message)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">로그인</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email" placeholder="이메일" required
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="password" placeholder="비밀번호" required
          value={password} onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <button type="submit" className="bg-black text-white px-4 py-2 rounded w-full">
          로그인
        </button>
      </form>
      {message && <p className="mt-4 text-sm">{message}</p>}
      <p className="mt-4 text-sm">
        계정이 없나요? <a href="/signup" className="underline">회원가입</a>
      </p>
    </main>
  )
}