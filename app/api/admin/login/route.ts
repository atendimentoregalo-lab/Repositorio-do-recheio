import { NextRequest, NextResponse } from 'next/server'
import { createHash, timingSafeEqual } from 'crypto'

function makeToken(pass: string) {
  const secret = process.env.ADMIN_SECRET || 'pudim-admin-2026'
  return createHash('sha256').update(pass + secret).digest('hex')
}

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const expected = process.env.ADMIN_PASSWORD

  if (!password || !expected) {
    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
  }

  const a = Buffer.from(password)
  const b = Buffer.from(expected)
  const match = a.length === b.length && timingSafeEqual(a, b)

  if (!match) {
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_token', makeToken(expected), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return res
}
