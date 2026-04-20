import { createHash } from 'crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

function makeToken(pass: string) {
  const secret = process.env.ADMIN_SECRET || 'pudim-admin-2026'
  return createHash('sha256').update(pass + secret).digest('hex')
}

export async function requireAdmin(): Promise<NextResponse | null> {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const jar   = await cookies()
  const token = jar.get('admin_token')?.value
  if (!token || token !== makeToken(password)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  return null // autorizado
}
