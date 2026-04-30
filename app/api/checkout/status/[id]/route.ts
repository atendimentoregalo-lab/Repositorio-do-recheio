import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { PRODUCTS } from '@/lib/products'
import { kv } from '@vercel/kv'
import type { PudimConfig } from '@/app/api/admin/config/route'
import { saveCustomer } from '@/app/api/admin/crm/route'

const MP_TOKEN    = process.env.MP_ACCESS_TOKEN!
const RESEND_KEY  = process.env.RESEND_API_KEY
const FROM_EMAIL  = process.env.RESEND_FROM ?? 'Clara Aureliano <onboarding@resend.dev>'
const SUPABASE_FN = 'https://phyznlckywngdgphlyho.supabase.co/functions/v1/gg-webhook'

const entregues = new Set<string>()

async function getDeliveryUrl(produtoId: string, bumpId?: string): Promise<{ nome: string; url: string } | null> {
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
  // Fallback para lib/products.ts
  const p = PRODUCTS[bumpId ?? produtoId]
  if (p) return { nome: p.nome, url: p.deliveryUrl }
  return null
}

function buildEmailHtml(nome: string, itens: { nome: string; url: string }[]) {
  const botoes = itens
    .filter(i => i.url)
    .map(i => `
      <div style="background:#fff8f0;border:1px solid #fed7aa;border-radius:12px;padding:16px 20px;margin-bottom:14px">
        <div style="font-size:15px;font-weight:700;color:#1c1917;margin-bottom:10px">🍮 ${i.nome}</div>
        <a href="${i.url}" style="display:inline-block;background:#ea580c;color:white;text-decoration:none;padding:11px 24px;border-radius:8px;font-size:14px;font-weight:700">
          Acessar material →
        </a>
      </div>`)
    .join('')

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#fffbf0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:520px;margin:0 auto;padding:32px 16px">
    <div style="text-align:center;margin-bottom:28px">
      <div style="font-size:52px">🍮</div>
      <h1 style="font-size:22px;font-weight:800;color:#1c1917;margin:12px 0 4px">Pagamento confirmado! 🎉</h1>
      <p style="color:#78716c;font-size:14px;margin:0">Oi ${nome}, seus materiais estão aqui embaixo 👇</p>
    </div>
    ${botoes || '<p style="color:#78716c;text-align:center">Seu acesso será enviado em breve.</p>'}
    <div style="background:white;border-radius:12px;padding:16px 20px;margin-top:8px;font-size:13px;color:#92400e;line-height:1.6;border:1px solid #fed7aa">
      ♾️ <strong>Acesso vitalício</strong> — guarde esse e-mail, os links não expiram nunca!
    </div>
    <p style="text-align:center;color:#a8a29e;font-size:13px;margin-top:24px;line-height:1.8">
      Com carinho, <strong style="color:#ea580c">Clara Aureliano</strong> 💛<br>
      Dúvidas? Responda esse e-mail que resolvo na hora.
    </p>
  </div>
</body>
</html>`
}

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

  const wasSet = await kv.set(`processed:${id}`, 1, { nx: true, ex: 86400 }).catch(() => null)
  if (data.status === 'approved' && wasSet) {

    const nomeQS  = req.nextUrl.searchParams.get('nome') || ''
    const emailQS = req.nextUrl.searchParams.get('email') || ''
    const buyer   = await kv.get<{ nome: string; email: string }>(`buyer:${id}`).catch(() => null)
    const nome    = nomeQS || buyer?.nome || data.payer?.first_name || 'Amiga'
    const email   = emailQS || buyer?.email || data.payer?.email || ''
    const produto = req.nextUrl.searchParams.get('produto') || ''
    const bumpsQS = req.nextUrl.searchParams.get('bumps') || ''
    const valor   = String((data.transaction_amount ?? 0).toFixed(2).replace('.', ','))

    // Monta lista de materiais (produto principal + bumps) lendo do KV
    const itens: { nome: string; url: string }[] = []
    const prodInfo = await getDeliveryUrl(produto)
    if (prodInfo) itens.push(prodInfo)
    if (bumpsQS) {
      for (const bumpId of bumpsQS.split(',')) {
        const b = await getDeliveryUrl(produto, bumpId.trim())
        if (b) itens.push(b)
      }
    }

    // Envia e-mail via Resend
    if (RESEND_KEY && email) {
      const resend = new Resend(RESEND_KEY)
      resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: '🍮 Seu Pudim Sem Fogo está aqui!',
        html: buildEmailHtml(nome, itens),
      }).catch(err => console.error('Resend error:', err))
    }

    // Salva no CRM
    const bumpsArr = bumpsQS ? bumpsQS.split(',').filter(Boolean) : []
    saveCustomer({
      nome, email, produto, bumps: bumpsArr, valor,
      payment_id: id, created_at: new Date().toISOString(),
    }).catch(e => console.error('CRM save error:', e))

    // Webhook Supabase — notificação de venda confirmada
    fetch(SUPABASE_FN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'pagamento_confirmado',
        nome,
        email,
        valor,
        produto: prodInfo?.nome ?? produto,
        payment_id: id,
        timestamp: new Date().toISOString(),
      }),
    }).then(async r => {
      if (!r.ok) console.error('Webhook pagamento_confirmado error:', r.status, await r.text())
    }).catch(e => console.error('Webhook fetch error:', e))
  }

  return NextResponse.json({ status: data.status })
}
