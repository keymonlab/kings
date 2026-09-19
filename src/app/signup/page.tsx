'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

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

    // 세션을 명시적으로 설정 (signUp 직후 RLS 통과를 위해 필요)
    if (data.session) {
      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      })
    }

    if (!data.user) {
      setMessage('가입 확인 이메일을 발송했습니다. 이메일을 확인해주세요.')
      return
    }

    // profiles 테이블에 닉네임 저장
    const { error: profileError } = await supabase.from('profiles').insert({
      user_id: data.user.id,
      nickname,
    })

    if (profileError) {
      setMessage('프로필 저장 오류: ' + profileError.message)
      return
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