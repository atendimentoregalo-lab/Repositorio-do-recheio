import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { requireAdmin } from '@/lib/admin-auth'

export type CrmCustomer = {
  nome: string
  email: string
  produto: string
  bumps: string[]
  valor: string
  payment_id: string
  created_at: string
}

export type CrmSegment = 'basico' | 'basico-bump' | 'premium' | 'premium-bump'

export const SEGMENTS: Record<CrmSegment, { label: string; cor: string; proxPasso: string }> = {
  'basico':       { label: 'Básico',                cor: '#f59e0b', proxPasso: 'Oferecer upgrade Premium (R$ 9,90)' },
  'basico-bump':  { label: 'Básico + Sobremesas',   cor: '#10b981', proxPasso: 'Oferecer upgrade para Premium' },
  'premium':      { label: 'Premium',               cor: '#6366f1', proxPasso: 'Oferecer Sobremesas Sem Fogo' },
  'premium-bump': { label: 'Premium + Sobremesas',  cor: '#ea580c', proxPasso: 'Próximo produto da esteira 🔥' },
}

export function getSegment(produto: string, bumps: string[]): CrmSegment {
  const isPremium = produto.includes('premium')
  const hasBump   = bumps.length > 0
  if (isPremium && hasBump)  return 'premium-bump'
  if (isPremium)             return 'premium'
  if (hasBump)               return 'basico-bump'
  return 'basico'
}

export async function saveCustomer(customer: CrmCustomer) {
  const seg = getSegment(customer.produto, customer.bumps)
  await kv.lpush(`crm:${seg}`, JSON.stringify(customer))
}

export async function GET() {
  const unauth = await requireAdmin()
  if (unauth) return unauth
  try {
    const results: Record<CrmSegment, CrmCustomer[]> = {
      'basico': [], 'basico-bump': [], 'premium': [], 'premium-bump': []
    }
    for (const seg of Object.keys(SEGMENTS) as CrmSegment[]) {
      const raw = await kv.lrange<string>(`crm:${seg}`, 0, -1)
      results[seg] = raw.map(r => typeof r === 'string' ? JSON.parse(r) : r)
    }
    return NextResponse.json(results)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// DELETE — limpar segmento específico (uso interno)
export async function DELETE(req: NextRequest) {
  const unauth = await requireAdmin()
  if (unauth) return unauth
  const { seg } = await req.json()
  if (seg) await kv.del(`crm:${seg}`)
  return NextResponse.json({ ok: true })
}
