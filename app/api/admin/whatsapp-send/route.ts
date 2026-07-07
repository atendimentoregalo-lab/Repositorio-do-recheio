import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { sendWhatsAppTemplate } from '@/lib/whatsapp'

const CHECKOUT_URL = process.env.NEXT_PUBLIC_URL ?? 'https://recheios-perfeitos-online.vercel.app'

export async function POST(req: NextRequest) {
  const unauth = await requireAdmin()
  if (unauth) return unauth

  const { whatsapp, nome, template } = await req.json()

  if (!whatsapp || !nome || !template) {
    return NextResponse.json({ error: 'whatsapp, nome e template são obrigatórios' }, { status: 400 })
  }

  const upsellLink = `${CHECKOUT_URL}/checkout.html?plano=premium`

  try {
    const result = await sendWhatsAppTemplate(whatsapp, template, [nome, upsellLink])
    return NextResponse.json({ ok: true, result })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
