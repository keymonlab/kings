import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { supabase } from '@/utils/supabase'
import Link from 'next/link'

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "역사 인물",
  description: "역사 인물을 골라 대화하고 기록을 얻는 서비스",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <nav className="border-b px-8 py-3 flex justify-between items-center">
          <Link href="/" className="font-bold">역사 인물</Link>
          <div className="flex gap-4 text-sm">
            {user ? (
              <>
                <Link href="/history" className="underline">내 기록</Link>
                <span className="text-gray-500">{user.email}</span>
              </>
            ) : (
              <Link href="/login" className="underline">로그인</Link>
            )}
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}