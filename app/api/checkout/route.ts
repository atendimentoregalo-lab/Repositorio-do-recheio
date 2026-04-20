import { NextRequest, NextResponse } from 'next/server'
import { PRODUCTS } from '@/lib/products'
import { kv } from '@vercel/kv'

const MP_TOKEN    = process.env.MP_ACCESS_TOKEN!
const SUPABASE_FN = 'https://phyznlckywngdgphlyho.supabase.co/functions/v1/gg-webhook'

async function notificar(payload: object) {
  try {
    const r = await fetch(SUPABASE_FN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!r.ok) console.error('Webhook error:', r.status, await r.text())
  } catch (e) {
    console.error('Webhook fetch error:', e)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { produto, nome, email, valor: valorCustom } = await req.json()

    const prod = PRODUCTS[produto]
    if (!prod) {
      return NextResponse.json({ error: 'Produto inválido' }, { status: 400 })
    }

    const valorFinal = valorCustom
      ? parseFloat(String(valorCustom).replace(',', '.'))
      : prod.valor

    const r = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MP_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `${email}-${produto}-${Date.now()}`,
      },
      body: JSON.stringify({
        transaction_amount: valorFinal,
        description: prod.nome,
        payment_method_id: 'pix',
        payer: { email, first_name: nome || 'Cliente' },
      }),
    })

    if (!r.ok) {
      const err = await r.text()
      console.error('MP error:', err)
      return NextResponse.json({ error: 'Erro ao gerar PIX' }, { status: 500 })
    }

    const data = await r.json()
    const pix  = data.point_of_interaction?.transaction_data

    // Salva dados do comprador no KV (TTL 2h) para recuperar ao confirmar pagamento
    kv.set(`buyer:${data.id}`, { nome: nome || 'Cliente', email }, { ex: 7200 }).catch(() => {})

    // Notifica PIX gerado (alguém chegou no checkout)
    notificar({
      event: 'pix_gerado',
      nome: nome || 'Cliente',
      email,
      valor: valorFinal.toFixed(2).replace('.', ','),
      produto: prod.nome,
      payment_id: String(data.id),
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      payment_id: data.id,
      qr_code: pix?.qr_code,
      qr_code_base64: pix?.qr_code_base64,
      valor: prod.valor,
      acesso: prod.deliveryUrl,
    })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
