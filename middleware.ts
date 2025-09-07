import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rate limiting store (in production, use Redis)
const rateLimitMap = new Map()

export function middleware(request: NextRequest) {
  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const ip = request.ip ?? "127.0.0.1"
    const limit = 100 // requests per window
    const windowMs = 15 * 60 * 1000 // 15 minutes

    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, {
        count: 0,
        lastReset: Date.now(),
      })
    }

    const ipData = rateLimitMap.get(ip)

    if (Date.now() - ipData.lastReset > windowMs) {
      ipData.count = 0
      ipData.lastReset = Date.now()
    }

    if (ipData.count >= limit) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    ipData.count += 1
  }

  // Admin route protection (will be enhanced with authentication)
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // TODO: Add authentication check here
    // For now, just allow access - implement with NextAuth.js
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
}
