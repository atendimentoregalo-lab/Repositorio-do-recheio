'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { PudimConfig, BumpConfig } from '@/app/api/admin/config/route'

const S = {
  page: { minHeight: '100dvh', background: '#fafaf9', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' } as React.CSSProperties,
  header: { background: 'white', borderBottom: '1px solid #e7e5e4', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, position: 'sticky', top: 0, zIndex: 10 } as React.CSSProperties,
  body: { maxWidth: 680, margin: '0 auto', padding: '24px 16px 60px' } as React.CSSProperties,
  card: { background: 'white', borderRadius: 14, padding: '20px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,.07)' } as React.CSSProperties,
  sectionTitle: { fontSize: 13, fontWeight: 700, color: '#78716c', textTransform: 'uppercase' as const, letterSpacing: '.6px', marginBottom: 16 },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#78716c', marginBottom: 6 } as React.CSSProperties,
  input: { width: '100%', padding: '10px 12px', border: '1.5px solid #e7e5e4', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', background: 'white' } as React.CSSProperties,
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 } as React.CSSProperties,
  btn: (color: string, small = false) => ({
    background: color, color: 'white', border: 'none', borderRadius: 8,
    padding: small ? '7px 14px' : '11px 20px', fontSize: small ? 13 : 14,
    fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
  } as React.CSSProperties),
  divider: { border: 'none', borderTop: '1px solid #f5f5f4', margin: '16px 0' } as React.CSSProperties,
  bumpCard: { border: '1.5px solid #e7e5e4', borderRadius: 12, padding: 16, marginBottom: 12 } as React.CSSProperties,
}

function Field({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={S.label}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={S.input} />
    </div>
  )
}

function newBump(): BumpConfig {
  return { id: 'bump-' + Date.now(), nome: '', desc: '', precoOriginal: '', precoAdicional: 0, emoji: '🎁', deliveryUrl: '' }
}

export default function AdminPudim() {
  const router = useRouter()
  const [config, setConfig]   = useState<PudimConfig | null>(null)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/config')
      .then(r => r.json())
      .then(data => { setConfig(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function save() {
    if (!config) return
    setSaving(true)
    setSaved(false)
    await fetch('/api/admin/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  function setProd(key: 'pudim-basic' | 'pudim-premium', field: string, value: string) {
    setConfig(c => c ? { ...c, produtos: { ...c.produtos, [key]: { ...c.produtos[key], [field]: field === 'valor' ? parseFloat(value) || 0 : value } } } : c)
  }

  function setBump(i: number, field: keyof BumpConfig, value: string) {
    setConfig(c => {
      if (!c) return c
      const bumps = [...c.bumps]
      bumps[i] = { ...bumps[i], [field]: field === 'precoAdicional' ? parseFloat(value) || 0 : value }
      return { ...c, bumps }
    })
  }

  function addBump() {
    setConfig(c => c ? { ...c, bumps: [...c.bumps, newBump()] } : c)
  }

  function removeBump(i: number) {
    setConfig(c => c ? { ...c, bumps: c.bumps.filter((_, j) => j !== i) } : c)
  }

  if (loading) return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 32 }}>🍮</div>
    </div>
  )

  if (!config) return <div style={S.page}><p style={{ padding: 24, color: '#ef4444' }}>Erro ao carregar configuração.</p></div>

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>🍮</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#1c1917' }}>Admin — Pudim Sem Fogo</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {saved && <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>✅ Salvo!</span>}
          <button onClick={save} disabled={saving} style={S.btn(saving ? '#fed7aa' : '#ea580c')}>
            {saving ? 'Salvando...' : 'Salvar tudo'}
          </button>
          <button onClick={logout} style={{ background: 'none', border: '1.5px solid #e7e5e4', borderRadius: 8, padding: '7px 14px', fontSize: 13, color: '#78716c', cursor: 'pointer', fontFamily: 'inherit' }}>
            Sair
          </button>
        </div>
      </div>

      <div style={S.body}>

        {/* Plano Básico */}
        <div style={S.card}>
          <div style={S.sectionTitle}>📦 Plano Básico</div>
          <Field label="Nome do produto" value={config.produtos['pudim-basic'].nome} onChange={v => setProd('pudim-basic', 'nome', v)} />
          <div style={S.row2}>
            <Field label="Preço (R$)" type="number" value={config.produtos['pudim-basic'].valor} onChange={v => setProd('pudim-basic', 'valor', v)} placeholder="3.49" />
            <div />
          </div>
          <Field label="Link de entrega (Google Drive)" value={config.produtos['pudim-basic'].deliveryUrl} onChange={v => setProd('pudim-basic', 'deliveryUrl', v)} placeholder="https://drive.google.com/file/d/..." />
          {config.produtos['pudim-basic'].deliveryUrl && (
            <a href={config.produtos['pudim-basic'].deliveryUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#ea580c' }}>↗ Testar link</a>
          )}
        </div>

        {/* Plano Premium */}
        <div style={S.card}>
          <div style={S.sectionTitle}>⭐ Plano Premium</div>
          <Field label="Nome do produto" value={config.produtos['pudim-premium'].nome} onChange={v => setProd('pudim-premium', 'nome', v)} />
          <div style={S.row2}>
            <Field label="Preço (R$)" type="number" value={config.produtos['pudim-premium'].valor} onChange={v => setProd('pudim-premium', 'valor', v)} placeholder="9.90" />
            <div />
          </div>
          <Field label="Link de entrega (Google Drive)" value={config.produtos['pudim-premium'].deliveryUrl} onChange={v => setProd('pudim-premium', 'deliveryUrl', v)} placeholder="https://drive.google.com/file/d/..." />
          {config.produtos['pudim-premium'].deliveryUrl && (
            <a href={config.produtos['pudim-premium'].deliveryUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#ea580c' }}>↗ Testar link</a>
          )}
        </div>

        {/* Order Bumps */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={S.sectionTitle}>🎁 Order Bumps</div>
            <button onClick={addBump} style={S.btn('#2563eb', true)}>+ Adicionar bump</button>
          </div>

          {config.bumps.length === 0 && (
            <p style={{ color: '#a8a29e', fontSize: 14, textAlign: 'center', padding: '12px 0' }}>Nenhum bump configurado.</p>
          )}

          {config.bumps.map((bump, i) => (
            <div key={bump.id} style={S.bumpCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1c1917' }}>Bump {i + 1} {bump.emoji}</span>
                <button onClick={() => removeBump(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                  Remover
                </button>
              </div>

              <div style={S.row2}>
                <Field label="Emoji (fallback)" value={bump.emoji} onChange={v => setBump(i, 'emoji', v)} placeholder="🍰" />
                <Field label="ID único (sem espaços)" value={bump.id} onChange={v => setBump(i, 'id', v)} placeholder="sobremesas-bump" />
              </div>
              <Field label="Nome" value={bump.nome} onChange={v => setBump(i, 'nome', v)} placeholder="Sobremesas Sem Fogo — Coleção Completa" />
              <Field label="Descrição curta" value={bump.desc} onChange={v => setBump(i, 'desc', v)} placeholder="+25 sobremesas geladas, mousses, pavês..." />
              <div style={S.row2}>
                <Field label="Preço original (ex: R$ 19,90)" value={bump.precoOriginal} onChange={v => setBump(i, 'precoOriginal', v)} placeholder="R$ 19,90" />
                <Field label="Preço adicional (R$)" type="number" value={bump.precoAdicional} onChange={v => setBump(i, 'precoAdicional', v)} placeholder="4.90" />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={S.label}>URL da imagem</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <input
                    type="text"
                    value={bump.imageUrl ?? ''}
                    onChange={e => setBump(i, 'imageUrl', e.target.value)}
                    placeholder="https://i.imgur.com/xxx.jpg"
                    style={{ ...S.input, flex: 1 }}
                  />
                  {bump.imageUrl && (
                    <img src={bump.imageUrl} alt="preview" style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', flexShrink: 0, border: '1.5px solid #e7e5e4' }} />
                  )}
                </div>
              </div>
              <Field label="Link de entrega (Google Drive)" value={bump.deliveryUrl} onChange={v => setBump(i, 'deliveryUrl', v)} placeholder="https://drive.google.com/file/d/..." />
              {bump.deliveryUrl && (
                <a href={bump.deliveryUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#2563eb' }}>↗ Testar link</a>
              )}
            </div>
          ))}
        </div>

        {/* Botão de salvar no final também */}
        <button onClick={save} disabled={saving} style={{ ...S.btn(saving ? '#fed7aa' : '#ea580c'), width: '100%', padding: '14px' }}>
          {saving ? 'Salvando...' : '💾 Salvar configurações'}
        </button>

      </div>
    </div>
  )
}
