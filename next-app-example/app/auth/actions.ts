'use server'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
export async function signUp(formData: FormData) {
  const fullName = String(formData.get('fullName') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  if (!fullName || !email || !password) {
    redirect('/login?message=Please fill in all signup fields')
  }
  const supabase = await createClient()
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=/dashboard`,
      data: {
        full_name: fullName,
      },
    },
  })
  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }
  redirect('/login?message=Check your email to verify your account')
}
export async function signIn(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  if (!email || !password) {
    redirect('/login?message=Please enter email and password')
  }
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }
  redirect('/dashboard')
}
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
