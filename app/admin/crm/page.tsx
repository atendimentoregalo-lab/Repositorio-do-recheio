'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { CrmCustomer, CrmSegment } from '@/app/api/admin/crm/route'

const SEGMENTS: Record<CrmSegment, { label: string; cor: string; proxPasso: string; emoji: string }> = {
  'basico':       { label: 'Básico',         cor: '#f59e0b', proxPasso: 'Oferecer upgrade Premium (R$ 9,90)', emoji: '🥉' },
  'basico-bump':  { label: 'Básico + Bump',  cor: '#10b981', proxPasso: 'Oferecer upgrade para Premium',      emoji: '🥈' },
  'premium':      { label: 'Premium',        cor: '#6366f1', proxPasso: 'Oferecer bump complementar',         emoji: '🥇' },
  'premium-bump': { label: 'Premium + Bump', cor: '#ea580c', proxPasso: 'Próximo produto da esteira 🔥',     emoji: '💎' },
}

function exportCsv(seg: CrmSegment, customers: CrmCustomer[]) {
  const header = 'Nome,Email,WhatsApp,Produto,Bumps,Valor,Data\n'
  const rows   = customers.map(c =>
    `"${c.nome}","${c.email}","${c.whatsapp || ''}","${c.produto}","${c.bumps.join('+')}","R$ ${c.valor}","${new Date(c.created_at).toLocaleDateString('pt-BR')}"`
  ).join('\n')
  const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a'); a.href = url; a.download = `crm-${seg}.csv`; a.click()
}

const DELIVERY: Record<string, string> = {
  'basic':         'https://acesso-receitas-recheioss-basic1.lovable.app/',
  'premium':       'https://acesso-receitas-recheioss-basic1.lovable.app/',
  'pudim-basic':   'https://drive.google.com/file/d/1QTngFs-YiKdQqgalqtxXjBgREC0itQBf/view?usp=sharing',
  'pudim-premium': 'https://drive.google.com/drive/folders/1CF67gPBatYTwRSs82gg9Qo1eYfBb6fjO?usp=sharing',
}

const PROD_NOME: Record<string, string> = {
  'basic':         'Recheios Secretos Básico',
  'premium':       'Recheios Secretos Premium',
  'pudim-basic':   'Pudim Sem Fogo Básico',
  'pudim-premium': 'Pudim Sem Fogo Premium',
}

const UPSELL_URL = 'https://recheios-perfeitos-online.vercel.app/checkout.html?plano=premium'

function waPhone(raw: string) {
  const d = raw.replace(/\D/g, '')
  return d.startsWith('55') && d.length >= 12 ? d : '55' + d
}

function waLink(phone: string, text: string) {
  return `https://wa.me/${waPhone(phone)}?text=${encodeURIComponent(text)}`
}

function msgAcesso(c: CrmCustomer) {
  const nome    = c.nome.split(' ')[0]
  const produto = PROD_NOME[c.produto] ?? c.produto
  const link    = DELIVERY[c.produto] ?? ''
  const bumps   = c.bumps.length > 0 ? `\n\nVocê também levou: ${c.bumps.join(', ')} — os links estão no seu email 📧` : ''
  return `Oi ${nome}! 🎉 Seu acesso ao *${produto}* chegou!\n\nAcessa aqui:\n${link}${bumps}\n\nQualquer dúvida é só me chamar aqui 💛\n— Clara`
}

function msgUpsell(c: CrmCustomer) {
  const nome = c.nome.split(' ')[0]
  return `Oi ${nome}! 😍\n\nVocê está gostando das receitas do guia?\n\nTenho uma oferta especial pra você: o *Guia Premium* com 80 receitas completas por só *R$ 7,90!*\n\n👉 ${UPSELL_URL}\n\nÉ por tempo limitado! 🎂\n— Clara`
}

function WaLinks({ c }: { c: CrmCustomer }) {
  if (!c.whatsapp) return <span style={{ fontSize:11, color:'#ccc' }}>sem nº</span>
  const isPremium = c.produto.includes('premium')
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
      <a href={waLink(c.whatsapp, msgAcesso(c))} target="_blank" rel="noopener noreferrer"
        style={{ fontSize:11, fontWeight:700, background:'#128C7E', color:'white', textDecoration:'none', borderRadius:6, padding:'4px 8px', textAlign:'center', whiteSpace:'nowrap' }}>
        📲 Acesso
      </a>
      {!isPremium && (
        <a href={waLink(c.whatsapp, msgUpsell(c))} target="_blank" rel="noopener noreferrer"
          style={{ fontSize:11, fontWeight:700, background:'#ea580c', color:'white', textDecoration:'none', borderRadius:6, padding:'4px 8px', textAlign:'center', whiteSpace:'nowrap' }}>
          🎯 Upsell
        </a>
      )}
    </div>
  )
}

export default function CrmPage() {
  const router  = useRouter()
  const [data, setData]       = useState<Record<CrmSegment, CrmCustomer[]> | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSeg, setActiveSeg] = useState<CrmSegment>('basico')

  useEffect(() => {
    fetch('/api/admin/crm')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const total = data ? Object.values(data).reduce((s, arr) => s + arr.length, 0) : 0

  return (
    <div style={{ minHeight:'100dvh', background:'#fafaf9', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>

      {/* Header */}
      <div style={{ background:'white', borderBottom:'1px solid #e7e5e4', padding:'0 20px', display:'flex', alignItems:'center', justifyContent:'space-between', height:56, position:'sticky', top:0, zIndex:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:22 }}>📊</span>
          <span style={{ fontSize:16, fontWeight:700, color:'#1c1917' }}>CRM — Pudim Sem Fogo</span>
          {data && <span style={{ background:'#fff3e0', color:'#ea580c', borderRadius:20, padding:'2px 10px', fontSize:12, fontWeight:700 }}>{total} clientes</span>}
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => router.push('/admin/pudim')} style={{ background:'none', border:'1.5px solid #e7e5e4', borderRadius:8, padding:'7px 14px', fontSize:13, color:'#78716c', cursor:'pointer', fontFamily:'inherit' }}>
            ← Admin
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:200, fontSize:32 }}>🍮</div>
      ) : !data ? (
        <p style={{ padding:24, color:'#ef4444' }}>Erro ao carregar CRM.</p>
      ) : (
        <div style={{ maxWidth:900, margin:'0 auto', padding:'24px 16px 60px' }}>

          {/* Cards de resumo */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12, marginBottom:24 }}>
            {(Object.keys(SEGMENTS) as CrmSegment[]).map(seg => {
              const s = SEGMENTS[seg]
              const count = data[seg].length
              return (
                <button key={seg} onClick={() => setActiveSeg(seg)} style={{
                  background: activeSeg === seg ? s.cor : 'white',
                  color: activeSeg === seg ? 'white' : '#1c1917',
                  border: `2px solid ${s.cor}`,
                  borderRadius:14, padding:'16px', textAlign:'left', cursor:'pointer',
                  boxShadow: activeSeg === seg ? `0 4px 16px ${s.cor}44` : '0 1px 4px rgba(0,0,0,.07)',
                  transition:'all .15s', fontFamily:'inherit',
                }}>
                  <div style={{ fontSize:22, marginBottom:4 }}>{s.emoji}</div>
                  <div style={{ fontSize:13, fontWeight:700, marginBottom:2 }}>{s.label}</div>
                  <div style={{ fontSize:28, fontWeight:800, lineHeight:1 }}>{count}</div>
                  <div style={{ fontSize:11, opacity:.8, marginTop:4 }}>clientes</div>
                </button>
              )
            })}
          </div>

          {/* Lista do segmento ativo */}
          {(Object.keys(SEGMENTS) as CrmSegment[]).map(seg => {
            if (seg !== activeSeg) return null
            const s = SEGMENTS[seg]
            const customers = data[seg]
            return (
              <div key={seg}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                  <div>
                    <span style={{ fontSize:16, fontWeight:800, color:'#1c1917' }}>{s.emoji} {s.label}</span>
                    <span style={{ marginLeft:10, fontSize:12, background:'#f5f5f4', borderRadius:20, padding:'2px 10px', color:'#78716c', fontWeight:600 }}>{customers.length} clientes</span>
                  </div>
                  {customers.length > 0 && (
                    <button onClick={() => exportCsv(seg, customers)} style={{ background:'none', border:'1.5px solid #e7e5e4', borderRadius:8, padding:'7px 14px', fontSize:12, color:'#78716c', cursor:'pointer', fontFamily:'inherit', fontWeight:600 }}>
                      ↓ Exportar CSV
                    </button>
                  )}
                </div>

                {/* Próximo passo */}
                <div style={{ background:`${s.cor}15`, border:`1px solid ${s.cor}44`, borderRadius:10, padding:'10px 14px', marginBottom:14, fontSize:13, color:'#1c1917', display:'flex', alignItems:'center', gap:8 }}>
                  <span>🎯</span>
                  <span><strong>Próximo passo:</strong> {s.proxPasso}</span>
                </div>

                {customers.length === 0 ? (
                  <div style={{ background:'white', borderRadius:14, padding:32, textAlign:'center', color:'#a8a29e', fontSize:14, boxShadow:'0 1px 4px rgba(0,0,0,.07)' }}>
                    Nenhum cliente neste segmento ainda.
                  </div>
                ) : (
                  <div style={{ background:'white', borderRadius:14, boxShadow:'0 1px 4px rgba(0,0,0,.07)', overflow:'hidden' }}>
                    {/* Header da tabela */}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr auto auto auto', gap:8, padding:'10px 16px', borderBottom:'1px solid #f5f5f4', fontSize:11, fontWeight:700, color:'#78716c', textTransform:'uppercase', letterSpacing:'.5px' }}>
                      <span>Nome</span><span>Email</span><span>WhatsApp</span><span>Valor</span><span>Data</span><span>Upsell</span>
                    </div>
                    {customers.map((c, i) => (
                      <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr auto auto auto', gap:8, padding:'12px 16px', borderBottom: i < customers.length-1 ? '1px solid #f5f5f4' : 'none', alignItems:'start' }}>
                        <div>
                          <div style={{ fontSize:14, fontWeight:600, color:'#1c1917', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.nome}</div>
                          {c.bumps.length > 0 && (
                            <div style={{ fontSize:11, color:'#10b981', fontWeight:600, marginTop:2 }}>+ {c.bumps.join(', ')}</div>
                          )}
                        </div>
                        <span style={{ fontSize:13, color:'#78716c', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', paddingTop:2 }}>{c.email}</span>
                        <span style={{ fontSize:13, color:'#128C7E', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', paddingTop:2 }}>{c.whatsapp || '—'}</span>
                        <span style={{ fontSize:13, fontWeight:700, color:'#ea580c', whiteSpace:'nowrap', paddingTop:2 }}>R$ {c.valor}</span>
                        <span style={{ fontSize:12, color:'#a8a29e', whiteSpace:'nowrap', paddingTop:2 }}>{new Date(c.created_at).toLocaleDateString('pt-BR')}</span>
                        <WaLinks c={c} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

        </div>
      )}
    </div>
  )
}
