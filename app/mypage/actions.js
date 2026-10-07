'use server'

import { redirect } from 'next/navigation'
import { createClient } from '../../lib/supabase/server'

export async function login(formData) {
  const supabase = await createClient()
  const email = String(formData.get('email') || '')
  const password = String(formData.get('password') || '')
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) redirect('/mypage?error=' + encodeURIComponent(error.message))
  redirect('/mypage')
}

export async function signup(formData) {
  const supabase = await createClient()
  const email = String(formData.get('email') || '')
  const password = String(formData.get('password') || '')
  const { error } = await supabase.auth.signUp({ email, password })
  if (error) redirect('/mypage?error=' + encodeURIComponent(error.message))
  redirect('/mypage?message=' + encodeURIComponent('가입 확인 메일을 확인해 주세요.'))
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/mypage')
}
