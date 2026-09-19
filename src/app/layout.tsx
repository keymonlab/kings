import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "역사 인물",
  description: "역사 인물을 골라 대화하고 기록을 얻는 서비스",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex">
        {/* Sidebar */}
        <aside className="sidebar flex flex-col p-6 gap-6 shrink-0">
          <Link href="/" className="text-xl font-bold tracking-tight">
            ⚜️ 역사 인물
          </Link>

          <nav className="flex flex-col gap-1 mt-4">
            {user ? (
              <>
                <Link href="/" className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
                  🏠 인물 목록
                </Link>
                <Link href="/history" className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
                  📋 내 기록
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
                  🔑 로그인
                </Link>
                <Link href="/signup" className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
                  ✨ 회원가입
                </Link>
              </>
            )}
          </nav>

          {user && (
            <div className="mt-auto pt-4 border-t border-white/10">
              <p className="text-xs text-white/50 truncate">{user.email}</p>
            </div>
          )}
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </body>
    </html>
  )
}