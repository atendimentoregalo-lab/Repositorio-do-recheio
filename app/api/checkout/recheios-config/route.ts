import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { requireAdmin } from '@/lib/admin-auth'

const KV_KEY = 'recheios-checkout-config'

export async function GET() {
  try {
    const config = await kv.get(KV_KEY)
    if (config) return NextResponse.json(config)
  } catch {}
  return NextResponse.json(null)
}

export async function PUT(req: NextRequest) {
  const unauth = await requireAdmin()
  if (unauth) return unauth
  try {
    const body = await req.json()
    await kv.set(KV_KEY, body)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
