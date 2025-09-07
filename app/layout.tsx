import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import Link from "next/link"
import "./globals.css"

export const metadata: Metadata = {
  title: "Zenith - Futuristic Portfolio",
  description: "Personal portfolio showcasing web development, cybersecurity, and creative coding projects",
  generator: "v0.app",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        {/* Site Header Navigation */}
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
              <span className="inline-block h-2 w-2 rounded-full bg-primary" />
              <span>Portfolio</span>
            </Link>
            <div className="flex items-center gap-3 text-sm">
              <Link className="hover:text-primary transition-colors" href="/">Home</Link>
              <Link className="hover:text-primary transition-colors" href="/#projects">Projects</Link>
              <Link className="hover:text-primary transition-colors" href="/blogs">Blog</Link>
              <Link className="hover:text-primary transition-colors" href="/#contact">Contact</Link>
            </div>
          </nav>
        </header>

        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
