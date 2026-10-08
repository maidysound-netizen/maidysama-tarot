'use client'
import {useState} from 'react'
import {createClient} from '../../lib/supabase/client'

const plans=[
 {name:'ONE QUESTION',detail:'질문 1개 · 핵심 카드 리딩',price:19000},
 {name:'DEEP READING',detail:'질문 1개 · 심층 배열과 상세 해석',price:39000},
 {name:'RELATIONSHIP',detail:'관계 · 속마음 · 흐름 집중 리딩',price:49000},
 {name:'FULL SPREAD',detail:'복합 질문 · 종합 리딩',price:69000}
]
export default function Reading(){
 const [selected,setSelected]=useState(null)
 const [question,setQuestion]=useState('')
 const [message,setMessage]=useState('')
 const [busy,setBusy]=useState(false)
 const [receipt,setReceipt]=useState(null)
 async function submit(e){
  e.preventDefault();setMessage('')
  if(!question.trim()||question.trim().length<10){setMessage('질문을 10자 이상 작성해 주세요.');return}
  setBusy(true)
  try{
   const supabase=createClient()
   const {data:{user},error:authError}=await supabase.auth.getUser()
   if(authError||!user){setMessage('주문 접수에는 로그인이 필요합니다. MY TAROT에서 로그인 후 돌아와 주세요.');return}
   const {data,error}=await supabase.from('reading_orders').insert({owner_id:user.id,product_name:plans[selected].name,question:question.trim(),status:'payment_pending'}).select('id,product_name,status').single()
   if(error)throw error
   setReceipt(data)
  }catch(err){setMessage('접수 실패: '+(err?.message||String(err)))}
  finally{setBusy(false)}
 }
 return <main className="inner"><div className="kicker">PRIVATE READING</div><h1>질문을 남겨주세요.</h1><p className="lead">상품 선택 후 질문을 접수하세요. 결제 확인 후 리딩을 진행하며 결과는 MY TAROT에서 비공개로 확인할 수 있습니다.</p>
 <div className="plans">{plans.map((p,i)=><article key={p.name} style={selected===i?{outline:'2px solid #caa66a'}:{}}><small>0{i+1}</small><h2>{p.name}</h2><p>{p.detail}</p><strong>₩{p.price.toLocaleString('ko-KR')}</strong><button type="button" onClick={()=>{setSelected(i);setReceipt(null);setMessage('')}}>{selected===i?'선택됨 ✓':'이 리딩 선택'}</button></article>)}</div>
 {selected!==null&&<section style={{maxWidth:720,margin:'48px auto',padding:'28px',border:'1px solid #99774c',borderRadius:14}}>
 <div className="kicker">CHECKOUT · 주문 및 결제</div>
 <h2>{plans[selected].name}</h2><p>{plans[selected].detail}</p>
 <p style={{fontSize:24,fontWeight:700}}>결제 예정 금액 ₩{plans[selected].price.toLocaleString('ko-KR')}</p>
 {receipt?<div role="status"><h3>주문 접수 완료</h3><p>주문번호: {receipt.id}</p><p>현재 상태: 결제 대기</p><p>아직 결제된 것이 아닙니다. 입금 계좌 및 온라인 결제 수단은 준비 중이며, 결제 안내가 확정되기 전에는 송금하지 마세요.</p><a href="/mypage">MY TAROT에서 주문 확인 →</a></div>
 :<form onSubmit={submit}><label htmlFor="reading-question" style={{display:'block',marginBottom:12}}>상담받을 질문 (10자 이상)</label><textarea id="reading-question" required minLength={10} maxLength={5000} value={question} onChange={e=>setQuestion(e.target.value)} placeholder="상황과 궁금한 점을 구체적으로 작성해 주세요." style={{width:'100%',minHeight:160,padding:14,boxSizing:'border-box',borderRadius:8,background:'#21151b',color:'#fff',border:'1px solid #99774c'}}/>
 <p>결제 방식: 계좌이체 / 온라인 결제 준비 중</p><p style={{fontSize:13,opacity:.8}}>이 버튼은 결제를 청구하지 않고 결제 대기 주문만 접수합니다.</p>
 <button type="submit" disabled={busy||question.trim().length<10}>{busy?'접수 중...':'결제 대기 주문 접수'}</button></form>}
 {message&&<p role="alert" style={{marginTop:16}}>{message} {message.includes('로그인')&&<a href="/mypage">로그인하러 가기 →</a>}</p>}
 </section>}</main>
}