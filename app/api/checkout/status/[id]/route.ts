import { NextRequest, NextResponse } from 'next/server'

const MP_TOKEN = process.env.MP_ACCESS_TOKEN!

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const r = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
    headers: { Authorization: `Bearer ${MP_TOKEN}` },
    cache: 'no-store',
  })
  const data = await r.json()
  return NextResponse.json({ status: data.status })
}
