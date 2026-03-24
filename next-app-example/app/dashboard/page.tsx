import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/auth/actions'
export default async function DashboardPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) {
    redirect('/login')
  }
  const user = data.user
  const fullName = typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : 'User'
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-16 text-white">
      <div className="rounded-3xl border border-white/10 bg-zinc-950 p-8 shadow-2xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">Protected Route</p>
            <h1 className="mt-3 text-4xl font-semibold">Dashboard</h1>
            <p className="mt-3 text-zinc-400">
              Bu sayfa yalnızca giriş yapan kullanıcılar tarafından görüntülenebilir.
            </p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition hover:bg-white/10"
            >
              Çıkış yap
            </button>
          </form>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-zinc-400">Kullanıcı</p>
            <p className="mt-2 text-xl font-medium">{fullName}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-zinc-400">E-posta</p>
            <p className="mt-2 text-xl font-medium">{user.email}</p>
          </div>
        </div>
      </div>
    </main>
  )
}
