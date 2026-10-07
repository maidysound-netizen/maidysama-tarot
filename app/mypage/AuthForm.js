'use client'

import { useState } from 'react'
import { createClient } from '../../lib/supabase/client'

export default function AuthForm() {
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [message,setMessage]=useState('')
  const [busy,setBusy]=useState(false)

  async function run(mode) {
    setBusy(true); setMessage('처리 중...')
    try {
      const supabase=createClient()
      const result=mode==='signup'
        ? await supabase.auth.signUp({email:email.trim(),password})
        : await supabase.auth.signInWithPassword({email:email.trim(),password})
      if(result.error) { setMessage('오류: '+result.error.message); return }
      if(mode==='signup' && !result.data.session) setMessage('가입 요청 완료. 이메일 확인 메일이 왔다면 인증해 주세요.')
      else { setMessage('완료되었습니다.'); window.location.reload() }
    } catch(e) { setMessage('연결 오류: '+(e?.message || String(e))) }
    finally { setBusy(false) }
  }

  return <div><label>EMAIL<input value={email} onChange={e=>setEmail(e.target.value)} type="email" autoComplete="email" placeholder="you@example.com"/></label><label>PASSWORD<input value={password} onChange={e=>setPassword(e.target.value)} type="password" autoComplete="current-password" placeholder="8자 이상"/></label><div className="authButtons"><button type="button" disabled={busy || !email || password.length<8} onClick={()=>run('login')}>로그인</button><button type="button" disabled={busy || !email || password.length<8} onClick={()=>run('signup')}>회원가입</button></div>{message && <p className="authMessage">{message}</p>}</div>
}
