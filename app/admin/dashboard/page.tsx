'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { CrmCustomer, CrmSegment } from '@/app/api/admin/crm/route'

const SEG_LABEL: Record<CrmSegment, string> = {
  'basico':       '🥉 Básico',
  'basico-bump':  '🥈 Básico + Bump',
  'premium':      '🥇 Premium',
  'premium-bump': '💎 Premium + Bump',
}

const SEG_COLOR: Record<CrmSegment, string> = {
  'basico':       '#f59e0b',
  'basico-bump':  '#10b981',
  'premium':      '#6366f1',
  'premium-bump': '#ea580c',
}

function parseValor(v: string) {
  return parseFloat(String(v).replace(',', '.')) || 0
}

function isSameDay(iso: string, ref: Date) {
  const d = new Date(iso)
  return d.getFullYear() === ref.getFullYear() &&
         d.getMonth()    === ref.getMonth()    &&
         d.getDate()     === ref.getDate()
}

function fmtBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function DashboardPage() {
  const router = useRouter()
  const [data,    setData]    = useState<Record<CrmSegment, CrmCustomer[]> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/crm')
      .then(r => { if (r.status === 401) { router.push('/admin/login'); throw new Error('unauth') } return r.json() })
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
      <div style={{ textAlign: 'center', color: '#667781' }}>Carregando...</div>
    </div>
  )

  const today = new Date()
  const allCustomers: CrmCustomer[] = data
    ? (Object.values(data) as CrmCustomer[][]).flat()
    : []

  allCustomers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const todayCustomers = allCustomers.filter(c => isSameDay(c.created_at, today))
  const totalReceita   = allCustomers.reduce((s, c) => s + parseValor(c.valor), 0)
  const todayReceita   = todayCustomers.reduce((s, c) => s + parseValor(c.valor), 0)

  // Receita por segmento
  const segStats = (Object.keys(SEG_LABEL) as CrmSegment[]).map(seg => {
    const list = data?.[seg] ?? []
    return {
      seg,
      count: list.length,
      receita: list.reduce((s, c) => s + parseValor(c.valor), 0),
    }
  })

  // Últimos 7 dias
  const last7: { label: string; count: number; receita: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dayCustomers = allCustomers.filter(c => isSameDay(c.created_at, d))
    last7.push({
      label: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      count: dayCustomers.length,
      receita: dayCustomers.reduce((s, c) => s + parseValor(c.valor), 0),
    })
  }
  const maxReceita = Math.max(...last7.map(d => d.receita), 1)

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#128C7E', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ color: 'white', fontWeight: 700, fontSize: 17 }}>📊 Dashboard de Vendas</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/admin/crm"       style={{ color: 'rgba(255,255,255,.85)', fontSize: 13, textDecoration: 'none', background: 'rgba(255,255,255,.15)', padding: '6px 12px', borderRadius: 8 }}>CRM</a>
          <a href="/admin/pudim"     style={{ color: 'rgba(255,255,255,.85)', fontSize: 13, textDecoration: 'none', background: 'rgba(255,255,255,.15)', padding: '6px 12px', borderRadius: 8 }}>Config</a>
          <a href="/admin.html"      style={{ color: 'rgba(255,255,255,.85)', fontSize: 13, textDecoration: 'none', background: 'rgba(255,255,255,.15)', padding: '6px 12px', borderRadius: 8 }}>Admin</a>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px 16px' }}>

        {/* Cards principais */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Vendas hoje',    value: todayCustomers.length.toString(), sub: fmtBRL(todayReceita),    icon: '🛒', color: '#10b981' },
            { label: 'Receita hoje',   value: fmtBRL(todayReceita),             sub: `${todayCustomers.length} venda${todayCustomers.length !== 1 ? 's' : ''}`, icon: '💵', color: '#128C7E' },
            { label: 'Total de vendas',value: allCustomers.length.toString(),   sub: 'desde o início',        icon: '📦', color: '#6366f1' },
            { label: 'Receita total',  value: fmtBRL(totalReceita),             sub: `${allCustomers.length} clientes`, icon: '💰', color: '#ea580c' },
          ].map(c => (
            <div key={c.label} style={{ background: 'white', borderRadius: 14, padding: '18px 16px', boxShadow: '0 1px 3px rgba(0,0,0,.08)', borderLeft: `4px solid ${c.color}` }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{c.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#111', lineHeight: 1.1 }}>{c.value}</div>
              <div style={{ fontSize: 12, color: '#667781', marginTop: 4 }}>{c.label}</div>
              <div style={{ fontSize: 11, color: c.color, fontWeight: 600, marginTop: 2 }}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Gráfico últimos 7 dias */}
        <div style={{ background: 'white', borderRadius: 14, padding: '18px 16px', boxShadow: '0 1px 3px rgba(0,0,0,.08)', marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#111', marginBottom: 16 }}>📈 Receita — últimos 7 dias</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100 }}>
            {last7.map(d => (
              <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 10, color: '#128C7E', fontWeight: 700 }}>
                  {d.receita > 0 ? fmtBRL(d.receita).replace('R$ ', 'R$') : ''}
                </div>
                <div style={{
                  width: '100%', background: d.receita > 0 ? '#128C7E' : '#e9edef',
                  borderRadius: '6px 6px 0 0',
                  height: `${Math.max((d.receita / maxReceita) * 80, d.receita > 0 ? 8 : 4)}px`,
                  transition: 'height .3s',
                }} />
                <div style={{ fontSize: 10, color: '#667781' }}>{d.label}</div>
                {d.count > 0 && <div style={{ fontSize: 10, color: '#667781' }}>{d.count}x</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Por segmento */}
        <div style={{ background: 'white', borderRadius: 14, padding: '18px 16px', boxShadow: '0 1px 3px rgba(0,0,0,.08)', marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#111', marginBottom: 12 }}>🏷️ Por produto</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {segStats.map(s => (
              <div key={s.seg} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: SEG_COLOR[s.seg], flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: 14, color: '#111' }}>{SEG_LABEL[s.seg]}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>{s.count} vendas</div>
                <div style={{ fontSize: 13, color: '#128C7E', fontWeight: 700, minWidth: 80, textAlign: 'right' }}>{fmtBRL(s.receita)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Vendas recentes */}
        <div style={{ background: 'white', borderRadius: 14, padding: '18px 16px', boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#111', marginBottom: 14 }}>🕐 Vendas recentes</div>
          {allCustomers.length === 0 ? (
            <div style={{ color: '#667781', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>Nenhuma venda ainda</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {allCustomers.slice(0, 30).map((c, i) => {
                const seg = (c.produto?.includes('premium') ? (c.bumps?.length ? 'premium-bump' : 'premium') : (c.bumps?.length ? 'basico-bump' : 'basico')) as CrmSegment
                return (
                  <div key={c.payment_id || i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '11px 0',
                    borderBottom: i < allCustomers.length - 1 ? '1px solid #f0f2f5' : 'none',
                  }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: SEG_COLOR[seg] + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                      {SEG_LABEL[seg].split(' ')[0]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nome}</div>
                      <div style={{ fontSize: 12, color: '#667781', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.email}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#128C7E' }}>R$ {c.valor}</div>
                      <div style={{ fontSize: 11, color: '#aaa' }}>{fmtDate(c.created_at)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
