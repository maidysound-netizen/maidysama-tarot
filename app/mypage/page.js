import { createClient } from '../../lib/supabase/server'
import { logout } from './actions'
import AuthForm from './AuthForm'

export const dynamic = 'force-dynamic'

export default async function My() {
  let user = null
  let readings = []
  try {
    const supabase = await createClient()
    const result = await supabase.auth.getUser()
    user = result.data.user
    if (user) {
      const r = await supabase.from('reading_orders').select('id, product_name, status, created_at, published_at').order('created_at', { ascending: false })
      readings = r.data || []
    }
  } catch {}

  if (user) return <main className="inner"><div className="kicker">PRIVATE ARCHIVE</div><h1>MY TAROT</h1><div className="login"><div><h2>{user.email}</h2><p>이 계정의 비공개 리딩만 표시됩니다.</p>{readings.length ? readings.map(r => <p key={r.id}>{r.product_name} · {r.status}</p>) : <p>아직 접수된 리딩이 없습니다.</p>}</div><form action={logout}><button type="submit">로그아웃</button></form></div></main>

  return <main className="inner"><div className="kicker">PRIVATE ARCHIVE</div><h1>MY TAROT</h1><div className="login"><div><h2>당신의 리딩은 잠겨 있습니다.</h2><p>로그인하거나 회원가입하면 본인 계정의 비공개 리딩만 확인할 수 있습니다.</p></div><AuthForm /></div></main>
}
