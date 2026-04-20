import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { PRODUCTS } from '@/lib/products'

const KV_KEY = 'pudim-checkout-config'

export type BumpConfig = {
  id: string
  nome: string
  desc: string
  precoOriginal: string
  precoAdicional: number
  emoji: string
  imageUrl: string
  deliveryUrl: string
}

export type PudimConfig = {
  produtos: {
    'pudim-basic':   { nome: string; valor: number; deliveryUrl: string }
    'pudim-premium': { nome: string; valor: number; deliveryUrl: string }
  }
  bumps: BumpConfig[]
}

function defaultConfig(): PudimConfig {
  return {
    produtos: {
      'pudim-basic': {
        nome: PRODUCTS['pudim-basic'].nome,
        valor: PRODUCTS['pudim-basic'].valor,
        deliveryUrl: PRODUCTS['pudim-basic'].deliveryUrl,
      },
      'pudim-premium': {
        nome: PRODUCTS['pudim-premium'].nome,
        valor: PRODUCTS['pudim-premium'].valor,
        deliveryUrl: PRODUCTS['pudim-premium'].deliveryUrl,
      },
    },
    bumps: [
      {
        id: 'sobremesas-bump',
        nome: 'Sobremesas Sem Fogo — Coleção Completa',
        desc: '+25 sobremesas geladas, mousses, pavês e muito mais!',
        precoOriginal: 'R$ 19,90',
        precoAdicional: 4.90,
        emoji: '🍰',
        imageUrl: '',
        deliveryUrl: '',
      },
    ],
  }
}

export async function GET() {
  try {
    const config = await kv.get<PudimConfig>(KV_KEY)
    return NextResponse.json(config ?? defaultConfig())
  } catch {
    return NextResponse.json(defaultConfig())
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json() as PudimConfig
    await kv.set(KV_KEY, body)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
