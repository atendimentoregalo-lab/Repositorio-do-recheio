import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

function makeToken(pass: string) {
  const secret = process.env.ADMIN_SECRET || 'pudim-admin-2026'
  return createHash('sha256').update(pass + secret).digest('hex')
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (!pathname.startsWith('/admin')) return NextResponse.next()
  if (pathname === '/admin/login') return NextResponse.next()

  const token    = req.cookies.get('admin_token')?.value
  const password = process.env.ADMIN_PASSWORD
  const expected = password ? makeToken(password) : null

  if (!token || token !== expected) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*'] }
