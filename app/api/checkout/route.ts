import { NextRequest, NextResponse } from 'next/server'

const MP_TOKEN = process.env.MP_ACCESS_TOKEN!

const PRODUTOS = {
  basic: {
    nome: 'Recheios Secretos Básico',
    valor: 1.99,
    acesso: 'https://acesso-receitas-recheioss-basic1.lovable.app/',
  },
  premium: {
    nome: 'Recheios Secretos Premium',
    valor: 7.99,
    acesso: 'https://acesso-receitas-recheioss-basic1.lovable.app/',
  },
}

export async function POST(req: NextRequest) {
  try {
    const { produto, nome, email, valor: valorCustom } = await req.json()

    const prod = PRODUTOS[produto as keyof typeof PRODUTOS]
    if (!prod) {
      return NextResponse.json({ error: 'Produto inválido' }, { status: 400 })
    }

    const valorFinal = valorCustom ? parseFloat(String(valorCustom).replace(',', '.')) : prod.valor

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
    const pix = data.point_of_interaction?.transaction_data

    return NextResponse.json({
      payment_id: data.id,
      qr_code: pix?.qr_code,
      qr_code_base64: pix?.qr_code_base64,
      valor: prod.valor,
      acesso: prod.acesso,
    })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
