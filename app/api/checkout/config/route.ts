import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import type { PudimConfig } from '@/app/api/admin/config/route'
import { PRODUCTS } from '@/lib/products'

// Rota pública — apenas leitura, usada pelo pudim.html para carregar bumps e preços
export async function GET() {
  try {
    const config = await kv.get<PudimConfig>('pudim-checkout-config')
    if (config) return NextResponse.json(config)
  } catch {}

  // Fallback padrão
  return NextResponse.json({
    produtos: {
      'pudim-basic':   { nome: PRODUCTS['pudim-basic'].nome,   valor: PRODUCTS['pudim-basic'].valor,   deliveryUrl: '', imageUrl: '' },
      'pudim-premium': { nome: PRODUCTS['pudim-premium'].nome, valor: PRODUCTS['pudim-premium'].valor, deliveryUrl: '', imageUrl: '' },
    },
    bumps: [],
  })
}
