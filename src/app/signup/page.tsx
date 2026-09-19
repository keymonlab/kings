'use client'

import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (password !== confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다.')
      return
    }

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setMessage('오류: ' + error.message)
      return
    }

    // profiles 테이블에 닉네임 저장
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        nickname,
      })
    }

    setMessage('가입 완료. 메인 페이지로 이동합니다.')
    setTimeout(() => router.push('/'), 1000)
  }

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">회원가입</h1>
      <form onSubmit={handleSignUp} className="space-y-4">
        <input
          type="text" placeholder="닉네임" required
          value={nickname} onChange={(e) => setNickname(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="email" placeholder="이메일" required
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="password" placeholder="비밀번호 (6자 이상)" required
          value={password} onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="password" placeholder="비밀번호 확인" required
          value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <button type="submit" className="bg-black text-white px-4 py-2 rounded w-full">
          가입하기
        </button>
      </form>
      {message && <p className="mt-4 text-sm">{message}</p>}
      <p className="mt-4 text-sm">
        이미 계정이 있나요? <a href="/login" className="underline">로그인</a>
      </p>
    </main>
  )
}