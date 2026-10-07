'use server'

import { redirect } from 'next/navigation'
import { createClient } from '../../lib/supabase/server'

function errorUrl(message) {
  return '/mypage?error=' + encodeURIComponent(message)
}

export async function login(formData) {
  try {
    const supabase = await createClient()
    const email = String(formData.get('email') || '').trim()
    const password = String(formData.get('password') || '')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) redirect(errorUrl(error.message))
  } catch (e) {
    if (e?.digest?.startsWith?.('NEXT_REDIRECT')) throw e
    redirect(errorUrl(e?.message || '로그인 연결에 실패했습니다.'))
  }
  redirect('/mypage')
}

export async function signup(formData) {
  try {
    const supabase = await createClient()
    const email = String(formData.get('email') || '').trim()
    const password = String(formData.get('password') || '')
    if (!email || password.length < 8) redirect(errorUrl('이메일과 8자 이상의 비밀번호를 입력해 주세요.'))
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) redirect(errorUrl(error.message))
    if (data.session) redirect('/mypage?message=' + encodeURIComponent('회원가입과 로그인이 완료되었습니다.'))
    redirect('/mypage?message=' + encodeURIComponent('회원가입 요청 완료. 이메일 확인이 켜져 있다면 확인 메일을 열어 주세요.'))
  } catch (e) {
    if (e?.digest?.startsWith?.('NEXT_REDIRECT')) throw e
    redirect(errorUrl(e?.message || '회원가입 연결에 실패했습니다.'))
  }
}

export async function logout() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch {}
  redirect('/mypage')
}
