import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
export default async function HomePage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-16 text-white">
      <div className="w-full rounded-3xl border border-white/10 bg-zinc-950 p-10 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">Next.js + Supabase</p>
        <h1 className="mt-4 text-5xl font-semibold">Authentication starter</h1>
        <p className="mt-4 max-w-2xl text-zinc-400">
          Signup, login, session yönetimi ve protected dashboard akışı hazırlandı.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={data.user ? '/dashboard' : '/login'}
            className="rounded-2xl bg-white px-5 py-3 font-medium text-black transition hover:opacity-90"
          >
            {data.user ? 'Dashboard’a git' : 'Giriş yap'}
          </Link>
        </div>
      </div>
    </main>
  )
}

