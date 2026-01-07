import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')
    const { pathname } = request.nextUrl

    // If user is on login page and has token, redirect to dashboard
    if (pathname === '/login' && token) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // If user is on protected route (dashboard) and has NO token, redirect to login
    // Note: Since we moved dashboard to (dashboard) group which maps to root /, 
    // any route likely not public needs protection.
    // We can explicitly check for /login to avoid loops if we used a matcher.

    if (pathname !== '/login' && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
