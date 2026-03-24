import { signIn, signUp } from '@/app/auth/actions'
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const params = await searchParams
  const message = params.message
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-16">
      <div className="grid w-full gap-8 md:grid-cols-2">
        <section className="rounded-3xl border border-white/10 bg-zinc-950 p-8 text-white shadow-2xl">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-zinc-400">Supabase Auth</p>
          <h1 className="mb-4 text-4xl font-semibold">Giriş yap</h1>
          <p className="mb-8 text-zinc-400">
            Kullanıcı hesabı ile oturum açın. Session cookie middleware ile korunur.
          </p>
          <form action={signIn} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">E-posta</label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none ring-0"
                placeholder="ornek@mail.com"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-zinc-300">Şifre</label>
              <input
                name="password"
                type="password"
                required
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none ring-0"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-2xl bg-white px-4 py-3 font-medium text-black transition hover:opacity-90"
            >
              Giriş yap
            </button>
          </form>
        </section>
        <section className="rounded-3xl border border-white/10 bg-zinc-950 p-8 text-white shadow-2xl">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-zinc-400">Yeni hesap</p>
          <h2 className="mb-4 text-4xl font-semibold">Kayıt ol</h2>
          <p className="mb-8 text-zinc-400">
            Supabase ile hesap oluşturun. Doğrulama sonrası dashboard erişimi açılır.
          </p>
          <form action={signUp} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">Ad Soyad</label>
              <input
                name="fullName"
                type="text"
                required
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none ring-0"
                placeholder="Ahmet Yılmaz"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-zinc-300">E-posta</label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none ring-0"
                placeholder="ornek@mail.com"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-zinc-300">Şifre</label>
              <input
                name="password"
                type="password"
                required
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none ring-0"
                placeholder="En az 6 karakter"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-2xl bg-violet-500 px-4 py-3 font-medium text-white transition hover:bg-violet-400"
            >
              Hesap oluştur
            </button>
          </form>
          {message ? (
            <p className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">
              {message}
            </p>
          ) : null}
        </section>
      </div>
    </main>
  )
}
