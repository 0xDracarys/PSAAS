import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Suspense } from "react"
import Link from "next/link"
import { ThemeProvider } from "@/components/theme-provider"
import { ReadingListProvider } from "@/components/reading-list-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "DRACARYS | Shubham Bhasker — Security & Engineering",
  description: "Cybersecurity researcher, penetration tester, and full-stack builder portfolio.",
  generator: "v0.app",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

function DracarysLogo() {
  return (
    <div className="flex items-center gap-2.5 group cursor-pointer select-none">
      <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff3b00]/20 via-[#8052ff]/20 to-black border border-white/15 group-hover:border-[#ff9f1c]/70 transition-all duration-300 shadow-[0_0_15px_rgba(255,59,0,0.25)] group-hover:shadow-[0_0_20px_rgba(255,159,28,0.5)]">
        {/* Dragon Flame Emblem Vector */}
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoFlame" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff1a1a" />
              <stop offset="40%" stopColor="#ff9f1c" />
              <stop offset="85%" stopColor="#8052ff" />
              <stop offset="100%" stopColor="#00d2d3" />
            </linearGradient>
          </defs>
          {/* Dragon Head with Horns & Breath Silhouette */}
          <path
            d="M5 2.5L9.5 7L7 8L12 5.5L9.5 11L14 9L11.5 14L17 11L13.5 16.5L20.5 12.5C18 17.5 13 20.5 7 19.5C3.5 19 1.5 15.5 1.5 11.5C1.5 7 3.5 3.5 5 2.5Z"
            fill="url(#logoFlame)"
          />
          {/* Glowing Dragon Eye */}
          <polygon points="7,10 9.5,11 8,12 6,11" fill="#ffffff" />
          {/* Fire Sparks */}
          <circle cx="19" cy="11" r="1" fill="#ffb829" />
          <circle cx="21" cy="9" r="0.75" fill="#ff3b00" />
        </svg>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="font-mono text-[11px] font-bold text-[#ff9f1c] tracking-tight">0x</span>
        <span className="text-[15px] font-extrabold tracking-[0.18em] uppercase bg-gradient-to-r from-white via-white/95 to-[#ff9f1c] bg-clip-text text-transparent group-hover:from-white group-hover:to-[#ff3b00] transition-colors">
          DRACARYS
        </span>
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ff9f1c] animate-pulse ml-0.5 shadow-[0_0_8px_#ff9f1c]" />
      </div>
    </div>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark" style={{ colorScheme: 'dark' }}>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased bg-black text-white`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark" disableTransitionOnChange>
          <div className="relative min-h-screen bg-background text-foreground">
            {/* Site Header Navigation */}
            <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
              <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
                <Link href="/" className="flex items-center">
                  <DracarysLogo />
                </Link>
                <div className="flex items-center gap-4 sm:gap-6 text-[13px] font-medium tracking-wide">
                  <Link className="hover:text-[#ff9f1c] transition-colors" href="/">Home</Link>
                  <Link className="hover:text-[#ff9f1c] transition-colors" href="/#projects">Projects</Link>
                  <Link className="hover:text-[#ff9f1c] transition-colors" href="/blogs">Blog</Link>
                  <Link className="hover:text-[#ff9f1c] transition-colors" href="/#contact">Contact</Link>
                </div>
              </nav>
            </header>

            <ReadingListProvider>
              <Suspense fallback={null}>
                {children}
              </Suspense>
            </ReadingListProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
