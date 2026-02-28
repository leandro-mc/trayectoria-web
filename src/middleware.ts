// src/middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ─── Route groups ─────────────────────────────────────────────────────────────

const CANDIDATE_ROUTES = [
  '/dashboard',
  '/profile',
  '/applications',
  '/saved',
  '/ai',
  '/settings',
]

const COMPANY_ROUTES = [
  '/company/dashboard',
  '/company/profile',
  '/company/offers',
]

const AUTH_ROUTES = ['/login', '/register']

// ─── Helpers ─────────────────────────────────────────────────────────────────

interface PersistedAuth {
  state?: {
    isAuthenticated?: boolean
    user?: {
      role?: string
    }
    refreshToken?: string
  }
}

function parseAuthCookie(request: NextRequest): PersistedAuth | null {
  const cookie = request.cookies.get('trayectoria-auth')
  if (!cookie?.value) return null

  try {
    return JSON.parse(decodeURIComponent(cookie.value)) as PersistedAuth
  } catch {
    return null
  }
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl
  const auth = parseAuthCookie(request)

  const isAuthenticated = auth?.state?.isAuthenticated === true
  const role            = auth?.state?.user?.role

  // ── Redirect logged-in users away from auth pages ──────────────────────────
  const onAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r))
  if (onAuthRoute && isAuthenticated) {
    const destination = role === 'CANDIDATE' ? '/dashboard' : '/company/dashboard'
    return NextResponse.redirect(new URL(destination, request.url))
  }

  // ── Protect candidate routes ───────────────────────────────────────────────
  const onCandidateRoute = CANDIDATE_ROUTES.some((r) => pathname.startsWith(r))
  if (onCandidateRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(pathname)}`, request.url))
    }
    if (role !== 'CANDIDATE') {
      return NextResponse.redirect(new URL('/company/dashboard', request.url))
    }
  }

  // ── Protect company routes ─────────────────────────────────────────────────
  const onCompanyRoute = COMPANY_ROUTES.some((r) => pathname.startsWith(r))
  if (onCompanyRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(pathname)}`, request.url))
    }
    if (role !== 'COMPANY') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

// ─── Matcher — exclude static assets and API routes ──────────────────────────

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icons|images|fonts).*)',
  ],
}
