import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { kv } from '@vercel/kv'
import { PRODUCTS } from '@/lib/products'
import { saveCustomer } from '@/app/api/admin/crm/route'
import type { PudimConfig } from '@/app/api/admin/config/route'

const MP_TOKEN   = process.env.MP_ACCESS_TOKEN!
const RESEND_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.RESEND_FROM ?? 'Clara Aureliano <onboarding@resend.dev>'
const SUPABASE_FN = 'https://phyznlckywngdgphlyho.supabase.co/functions/v1/gg-webhook'

async function getDeliveryUrl(produtoId: string, bumpId?: string): Promise<{ nome: string; url: string } | null> {
  if (produtoId === 'basic' || produtoId === 'premium') {
    try {
      const rcfg = await kv.get<any>('recheios-checkout-config')
      if (rcfg) {
        const plan = rcfg[produtoId]
        if (bumpId && Array.isArray(plan?.bumps)) {
          const bump = plan.bumps.find((b: any) => b.id === bumpId)
          if (bump?.acesso) return { nome: bump.nome, url: bump.acesso }
        } else if (!bumpId && plan?.produto?.acesso) {
          return { nome: plan.produto.nome, url: plan.produto.acesso }
        }
      }
    } catch {}
  }
  try {
    const config = await kv.get<PudimConfig>('pudim-checkout-config')
    if (config) {
      if (bumpId) {
        const bump = config.bumps.find(b => b.id === bumpId)
        if (bump?.deliveryUrl) return { nome: bump.nome, url: bump.deliveryUrl }
      } else {
        const prod = config.produtos[produtoId as keyof typeof config.produtos]
        if (prod?.deliveryUrl) return { nome: prod.nome, url: prod.deliveryUrl }
      }
    }
  } catch {}
  const p = PRODUCTS[bumpId ?? produtoId]
  if (p?.deliveryUrl) return { nome: p.nome, url: p.deliveryUrl }
  return null
}

function buildEmailHtml(nome: string, itens: { nome: string; url: string }[]) {
  const botoes = itens
    .filter(i => i.url)
    .map(i => `
      <div style="background:#fff8f0;border:1px solid #fed7aa;border-radius:12px;padding:16px 20px;margin-bottom:14px">
        <div style="font-size:15px;font-weight:700;color:#1c1917;margin-bottom:10px">${i.nome}</div>
        <a href="${i.url}" style="display:inline-block;background:#ea580c;color:white;text-decoration:none;padding:11px 24px;border-radius:8px;font-size:14px;font-weight:700">
          Acessar material
        </a>
      </div>`)
    .join('')

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#fffbf0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:520px;margin:0 auto;padding:32px 16px">
    <div style="text-align:center;margin-bottom:28px">
      <h1 style="font-size:22px;font-weight:800;color:#1c1917;margin:12px 0 4px">Pagamento confirmado!</h1>
      <p style="color:#78716c;font-size:14px;margin:0">Oi ${nome}, seus materiais estao aqui embaixo</p>
    </div>
    ${botoes || '<p style="color:#78716c;text-align:center">Seu acesso sera enviado em breve.</p>'}
    <div style="background:white;border-radius:12px;padding:16px 20px;margin-top:8px;font-size:13px;color:#92400e;line-height:1.6;border:1px solid #fed7aa">
      <strong>Acesso vitalicio</strong> — guarde esse e-mail, os links nao expiram nunca!
    </div>
    <p style="text-align:center;color:#a8a29e;font-size:13px;margin-top:24px;line-height:1.8">
      Com carinho, <strong style="color:#ea580c">Clara Aureliano</strong><br>
      Duvidas? Responda esse e-mail que resolvo na hora.
    </p>
  </div>
</body>
</html>`
}

async function processPayment(paymentId: string) {
  // Dedup: só processa uma vez
  const wasSet = await kv.set(`processed:${paymentId}`, 1, { nx: true, ex: 86400 }).catch(() => null)
  if (!wasSet) {
    console.log(`[webhook] payment ${paymentId} já processado, ignorando`)
    return
  }

  // Busca dados do pagamento no MP
  const r = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${MP_TOKEN}` },
    cache: 'no-store',
  })
  const payment = await r.json()

  console.log(`[webhook] payment ${paymentId} status=${payment.status}`)

  if (payment.status !== 'approved') {
    // Remove o dedup para que possa ser processado quando chegar aprovado
    await kv.del(`processed:${paymentId}`).catch(() => {})
    return
  }

  // Recupera dados do comprador salvos no checkout
  const buyer = await kv.get<{
    nome: string
    email: string
    whatsapp?: string
    produto?: string
    bumps?: string[]
  }>(`buyer:${paymentId}`).catch(() => null)

  const nome     = buyer?.nome     || payment.payer?.first_name || 'Amiga'
  const email    = buyer?.email    || payment.payer?.email       || ''
  const whatsapp = buyer?.whatsapp || ''
  const produto  = buyer?.produto  || ''
  const bumpsArr = buyer?.bumps    || []
  const valor    = String((payment.transaction_amount ?? 0).toFixed(2).replace('.', ','))

  console.log(`[webhook] nome=${nome} email=${email} produto=${produto} bumps=${bumpsArr}`)

  // Monta materiais
  const itens: { nome: string; url: string }[] = []
  const prodInfo = await getDeliveryUrl(produto)
  if (prodInfo) itens.push(prodInfo)
  for (const bumpId of bumpsArr) {
    const b = await getDeliveryUrl(produto, bumpId)
    if (b) itens.push(b)
  }

  console.log(`[webhook] itens=${JSON.stringify(itens)}`)

  // Envia e-mail
  if (RESEND_KEY && email) {
    try {
      const resend = new Resend(RESEND_KEY)
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: produto.includes('pudim') ? 'Seu Pudim Sem Fogo esta aqui!' : 'Seus Recheios Secretos estao aqui!',
        html: buildEmailHtml(nome, itens),
      })
      console.log(`[webhook] Resend ok:`, JSON.stringify(result))
    } catch (err) {
      console.error('[webhook] Resend error:', err)
    }
  } else {
    console.log(`[webhook] email pulado — RESEND_KEY=${!!RESEND_KEY} email="${email}"`)
  }

  // Salva no CRM
  const bumpsNomes = itens.slice(1).map(i => i.nome)
  saveCustomer({
    nome, email, whatsapp, produto,
    bumps: bumpsNomes.length > 0 ? bumpsNomes : bumpsArr,
    valor,
    payment_id: paymentId,
    created_at: new Date().toISOString(),
  }).catch(e => console.error('[webhook] CRM save error:', e))

  // Webhook Supabase
  try {
    const whResp = await fetch(SUPABASE_FN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'pagamento_confirmado',
        nome, email, valor,
        produto: prodInfo?.nome ?? produto,
        payment_id: paymentId,
        timestamp: new Date().toISOString(),
      }),
    })
    if (!whResp.ok) console.error('[webhook] Supabase error:', whResp.status)
    else console.log('[webhook] Supabase ok')
  } catch (e) {
    console.error('[webhook] Supabase fetch error:', e)
  }
}

// POST — recebe notificações do Mercado Pago
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    console.log('[webhook] payload:', JSON.stringify(body))

    // Formato webhook MP: { type: "payment", data: { id: "123" } }
    // Formato IPN MP:     { topic: "payment", resource: "https://.../{id}" }
    let paymentId: string | null = null

    if (body?.type === 'payment' && body?.data?.id) {
      paymentId = String(body.data.id)
    } else if (body?.topic === 'payment' && body?.resource) {
      const match = String(body.resource).match(/\/(\d+)$/)
      if (match) paymentId = match[1]
    } else if (body?.action?.startsWith('payment') && body?.data?.id) {
      paymentId = String(body.data.id)
    }

    // MP também envia o ID via query string
    if (!paymentId) {
      paymentId = req.nextUrl.searchParams.get('id') ||
                  req.nextUrl.searchParams.get('data.id')
    }

    if (!paymentId) {
      console.log('[webhook] nenhum payment_id encontrado no payload')
      return NextResponse.json({ ok: true }) // 200 para MP não retentar
    }

    // Processa em background (MP espera resposta rápida)
    processPayment(paymentId).catch(e => console.error('[webhook] processPayment error:', e))

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[webhook] erro geral:', e)
    return NextResponse.json({ ok: true }) // sempre 200 para MP não retentar infinito
  }
}

// GET — MP às vezes valida o endpoint com GET antes de registrar
export async function GET() {
  return NextResponse.json({ ok: true, service: 'mp-webhook' })
}
