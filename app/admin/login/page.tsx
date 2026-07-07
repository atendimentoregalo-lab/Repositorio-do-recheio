'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    setLoading(false)
    if (res.ok) {
      router.push('/admin/pudim')
    } else {
      setError('Senha incorreta.')
    }
  }

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(170deg,#fffbf0,#fff3e0)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: 360, padding: '0 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48 }}>🍮</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1c1917', margin: '12px 0 4px' }}>
            Área Administrativa
          </h1>
          <p style={{ fontSize: 14, color: '#78716c' }}>Pudim Sem Fogo — Clara Aureliano</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,.08)' }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#78716c', marginBottom: 8 }}>
              SENHA
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
              style={{
                width: '100%', padding: '12px 14px', border: `1.5px solid ${error ? '#ef4444' : '#e7e5e4'}`,
                borderRadius: 10, fontSize: 16, outline: 'none', boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
            {error && <p style={{ color: '#ef4444', fontSize: 13, marginTop: 8 }}>{error}</p>}

            <button
              type="submit"
              disabled={loading || !password}
              style={{
                width: '100%', marginTop: 16, background: loading ? '#fed7aa' : '#ea580c',
                color: 'white', border: 'none', borderRadius: 10, padding: '13px',
                fontSize: 15, fontWeight: 700, cursor: loading ? 'default' : 'pointer',
                transition: 'background .2s', fontFamily: 'inherit',
              }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
