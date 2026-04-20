import { NextRequest, NextResponse } from 'next/server'

const MP_TOKEN    = process.env.MP_ACCESS_TOKEN!
const ENTREGA_URL = process.env.ENTREGA_ZAP_URL   // ex: https://xxxx.ngrok-free.app
const SUPABASE_FN = 'https://phyznlckywngdgphlyho.supabase.co/functions/v1/gg-webhook'

// Dedup em memória — evita dupla entrega enquanto a instância está viva
const entregues = new Set<string>()

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const r = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
    headers: { Authorization: `Bearer ${MP_TOKEN}` },
    cache: 'no-store',
  })
  const data = await r.json()

  if (data.status === 'approved' && !entregues.has(id)) {
    entregues.add(id)

    const nome       = data.payer?.first_name || 'Amiga'
    const email      = data.payer?.email || ''
    const telefone   = req.nextUrl.searchParams.get('tel') || ''
    const produto    = data.description || ''
    const valor      = String((data.transaction_amount ?? 0).toFixed(2).replace('.', ','))
    const comprouBump = req.nextUrl.searchParams.get('bump') === '1'

    // Entrega via WhatsApp (servidor local com ngrok)
    if (ENTREGA_URL && telefone) {
      fetch(`${ENTREGA_URL}/entregar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          telefone,
          produto,
          comprou_bump: comprouBump,
          payment_id: id,
        }),
      }).catch(() => {})
    }

    // Webhook Supabase — notificação de venda (server-side, sem CORS)
    fetch(SUPABASE_FN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'pagamento_confirmado',
        email,
        valor,
        produto,
        payment_id: id,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {})
  }

  return NextResponse.json({ status: data.status })
}
