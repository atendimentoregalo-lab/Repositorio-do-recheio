import { NextRequest, NextResponse } from 'next/server'

async function makeToken(pass: string): Promise<string> {
  const secret = process.env.ADMIN_SECRET || 'pudim-admin-2026'
  const data = new TextEncoder().encode(pass + secret)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (!pathname.startsWith('/admin')) return NextResponse.next()
  if (pathname === '/admin/login') return NextResponse.next()

  const token    = req.cookies.get('admin_token')?.value
  const password = process.env.ADMIN_PASSWORD
  const expected = password ? await makeToken(password) : null

  if (!token || token !== expected) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*'] }
