'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check, Copy, Loader2, Lock, ChevronRight } from 'lucide-react'

const PRODUTOS = {
  basic: {
    label: 'Básico',
    valor: 'R$ 1,99',
    descricao: '20 receitas de recheios cremosos',
    itens: ['20 Recheios Secretos', 'Com e sem fogo', 'Acesso imediato'],
    cor: 'from-orange-500 to-red-500',
  },
  premium: {
    label: 'Premium',
    valor: 'R$ 7,99',
    descricao: '+250 receitas + bônus exclusivos',
    itens: ['100 Recheios', '50 Lanches', '50 Sobremesas', '20 Caldas + 20 Tortas'],
    cor: 'from-orange-600 to-amber-500',
  },
}

type Etapa = 'form' | 'pix' | 'sucesso'

export default function CheckoutPage() {
  const params = useSearchParams()
  const produto = (params.get('produto') || 'basic') as keyof typeof PRODUTOS
  const prod = PRODUTOS[produto] ?? PRODUTOS.basic

  const [etapa, setEtapa] = useState<Etapa>('form')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const [paymentId, setPaymentId] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [qrBase64, setQrBase64] = useState('')
  const [acessoUrl, setAcessoUrl] = useState('')
  const [copiado, setCopiado] = useState(false)
  const [timer, setTimer] = useState(900) // 15 minutos

  // Polling de status
  const checarStatus = useCallback(async () => {
    if (!paymentId) return
    const r = await fetch(`/api/checkout/status/${paymentId}`)
    const { status } = await r.json()
    if (status === 'approved') {
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Purchase', {
          value: produto === 'premium' ? 7.99 : 1.99,
          currency: 'BRL',
          content_ids: [produto],
          content_type: 'product',
        })
      }
      setEtapa('sucesso')
    }
  }, [paymentId, produto])

  useEffect(() => {
    if (etapa !== 'pix') return
    const poll = setInterval(checarStatus, 3000)
    return () => clearInterval(poll)
  }, [etapa, checarStatus])

  // Timer regressivo
  useEffect(() => {
    if (etapa !== 'pix') return
    const t = setInterval(() => setTimer(p => (p > 0 ? p - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [etapa])

  // Redirect após sucesso
  useEffect(() => {
    if (etapa !== 'sucesso' || !acessoUrl) return
    const t = setTimeout(() => window.location.href = acessoUrl, 3000)
    return () => clearTimeout(t)
  }, [etapa, acessoUrl])

  async function gerarPix(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim() || !email.trim()) return
    setLoading(true)
    setErro('')
    try {
      const r = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produto, nome, email }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error)
      setPaymentId(String(data.payment_id))
      setQrCode(data.qr_code)
      setQrBase64(data.qr_code_base64)
      setAcessoUrl(data.acesso)
      setEtapa('pix')
    } catch (err: any) {
      setErro(err.message || 'Erro ao gerar PIX. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  async function copiarPix() {
    await navigator.clipboard.writeText(qrCode)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2500)
  }

  const mins = String(Math.floor(timer / 60)).padStart(2, '0')
  const secs = String(timer % 60).padStart(2, '0')

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-4xl">🍰</span>
          <h1 className="text-xl font-black text-gray-900 mt-2">Recheios Secretos</h1>
          <p className="text-sm text-gray-500">Checkout seguro via PIX</p>
        </div>

        {/* Card produto */}
        <div className={`bg-gradient-to-r ${prod.cor} text-white rounded-2xl p-5 mb-6 shadow-lg`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-lg">{prod.label}</span>
            <span className="text-2xl font-black">{prod.valor}</span>
          </div>
          <p className="text-white/80 text-sm mb-3">{prod.descricao}</p>
          <div className="flex flex-wrap gap-2">
            {prod.itens.map(item => (
              <span key={item} className="bg-white/20 rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1">
                <Check className="w-3 h-3" /> {item}
              </span>
            ))}
          </div>
        </div>

        {/* ETAPA 1 — Formulário */}
        {etapa === 'form' && (
          <form onSubmit={gerarPix} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="font-bold text-gray-900 text-lg">Seus dados</h2>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Nome completo</label>
              <input
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
                placeholder="Seu nome"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {erro && <p className="text-red-500 text-sm">{erro}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Gerar PIX <ChevronRight className="w-5 h-5" /></>}
            </button>

            <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> Pagamento 100% seguro via Mercado Pago
            </p>
          </form>
        )}

        {/* ETAPA 2 — QR Code PIX */}
        {etapa === 'pix' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 rounded-full px-4 py-1.5 text-sm font-semibold mb-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                Aguardando pagamento
              </div>
              <p className="text-sm text-gray-500">O QR Code expira em <span className="font-bold text-gray-800">{mins}:{secs}</span></p>
            </div>

            {qrBase64 && (
              <div className="flex justify-center">
                <img
                  src={`data:image/png;base64,${qrBase64}`}
                  alt="QR Code PIX"
                  className="w-52 h-52 rounded-xl border border-gray-100"
                />
              </div>
            )}

            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium">Ou copie o código PIX:</p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={qrCode}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-xs bg-gray-50 text-gray-600 overflow-hidden"
                />
                <button
                  onClick={copiarPix}
                  className="bg-orange-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1.5 hover:bg-orange-600 transition-colors"
                >
                  {copiado ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiado ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-1">
              <p className="font-semibold text-gray-800">Como pagar:</p>
              <p>1. Abra o app do seu banco</p>
              <p>2. Escolha pagar via PIX</p>
              <p>3. Escaneie o QR Code ou cole o código</p>
              <p>4. Confirme o valor de <strong>{prod.valor}</strong></p>
            </div>

            <p className="text-xs text-center text-gray-400">
              Após o pagamento, o acesso é liberado automaticamente ✨
            </p>
          </div>
        )}

        {/* ETAPA 3 — Sucesso */}
        {etapa === 'sucesso' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-900">Pagamento confirmado! 🎉</h2>
            <p className="text-gray-600">Redirecionando para sua área de membros em instantes...</p>
            <div className="flex justify-center">
              <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
            </div>
            <a
              href={acessoUrl}
              className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-8 rounded-2xl hover:opacity-90 transition-opacity"
            >
              Acessar agora →
            </a>
          </div>
        )}

      </div>
    </div>
  )
}
