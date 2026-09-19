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
    <div className="flex items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚜️</div>
          <h1 className="text-2xl font-bold">회원가입</h1>
          <p className="text-gray-400 mt-1">역사 인물과 대화를 시작하세요</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="text" placeholder="닉네임" required
            value={nickname} onChange={(e) => setNickname(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-accent focus:bg-white outline-none transition-colors"
          />
          <input
            type="email" placeholder="이메일" required
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-accent focus:bg-white outline-none transition-colors"
          />
          <input
            type="password" placeholder="비밀번호 (6자 이상)" required
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-accent focus:bg-white outline-none transition-colors"
          />
          <input
            type="password" placeholder="비밀번호 확인" required
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-accent focus:bg-white outline-none transition-colors"
          />
          <button type="submit" className="w-full bg-accent text-white py-3 rounded-xl font-medium hover:bg-accent-hover transition-colors shadow-lg">
            가입하기
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-red-500 text-center">{message}</p>}

        <p className="mt-6 text-sm text-center text-gray-500">
          이미 계정이 있나요? <a href="/login" className="text-accent font-medium">로그인</a>
        </p>
      </div>
    </div>
  )
}