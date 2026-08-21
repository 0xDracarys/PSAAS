"use client"

import { useEffect, useRef, useState } from "react"

// ─────────────────────────────────────────────────────────────────────────────
// DALA SIGNATURE CHROMATIC TRIANGLE CONSTELLATION (60 FPS OPTIMIZED)
// Rotating outlined triangles with inner glow + neural connections + cybersec shapes
// ─────────────────────────────────────────────────────────────────────────────

type Pt = { x: number; y: number }

function sampleOrganic(
  N: number,
  cX: number,
  cY: number,
  sc: number,
  inside: (nx: number, ny: number) => boolean
): Pt[] {
  const pts: Pt[] = []
  let tries = 0
  while (pts.length < N && tries < N * 40) {
    tries++
    const nx = (Math.random() - 0.5) * 2.6
    const ny = (Math.random() - 0.5) * 2.6
    if (inside(nx, ny)) {
      pts.push({ x: cX + nx * sc, y: cY + ny * sc })
    }
  }
  while (pts.length < N) {
    const ref = pts[Math.floor(Math.random() * (pts.length || 1))] || { x: cX, y: cY }
    pts.push({
      x: ref.x + (Math.random() - 0.5) * sc * 0.1,
      y: ref.y + (Math.random() - 0.5) * sc * 0.1,
    })
  }
  return pts.slice(0, N)
}

// ── ORGANIC SHAPE GENERATORS ─────────────────────────────────────────────────

function brainPts(N: number, cX: number, cY: number, sc: number): Pt[] {
  return sampleOrganic(N, cX, cY, sc, (nx, ny) => {
    const L = (nx + 0.55) ** 2 / 0.78 ** 2 + ny ** 2 / 0.88 ** 2 <= 1
    const R = (nx - 0.55) ** 2 / 0.78 ** 2 + ny ** 2 / 0.88 ** 2 <= 1
    const C = (nx + 0.1) ** 2 / 0.65 ** 2 + (ny + 0.72) ** 2 / 0.42 ** 2 <= 1
    const gap = Math.abs(nx) < 0.08 && ny > 0.22
    return (L || R || C) && !gap
  })
}

function shieldPts(N: number, cX: number, cY: number, sc: number): Pt[] {
  return sampleOrganic(N, cX, cY, sc, (nx, ny) => {
    if (ny < -0.92 || ny > 1.08) return false
    if (ny <= 0.18) return Math.abs(nx) <= 0.78
    const t = (ny - 0.18) / 0.9
    return Math.abs(nx) <= 0.78 * (1 - t)
  })
}

function skullPts(N: number, cX: number, cY: number, sc: number): Pt[] {
  const hY = -0.05
  return sampleOrganic(N, cX, cY, sc, (nx, ny) => {
    const inHead = nx * nx + (ny - hY) ** 2 <= 0.87 ** 2
    const inLEye = (nx + 0.3) ** 2 + (ny - hY + 0.08) ** 2 <= 0.21 ** 2
    const inREye = (nx - 0.3) ** 2 + (ny - hY + 0.08) ** 2 <= 0.21 ** 2
    const inNose = nx ** 2 + (ny - hY - 0.35) ** 2 <= 0.1 ** 2
    if (ny > hY + 0.52 && ny <= hY + 0.87 && Math.abs(nx) <= 0.45) {
      const toothCol = Math.floor((nx + 0.45) / 0.18)
      if (ny > hY + 0.67 && toothCol % 2 === 0) return false
      return true
    }
    return inHead && !inLEye && !inREye && !inNose
  })
}

function padlockPts(N: number, cX: number, cY: number, sc: number): Pt[] {
  const bodyT = 0.0, bodyB = 0.95, bodyW = 0.62
  const sInR = 0.3, sOutR = 0.52, sCY = 0.0
  return sampleOrganic(N, cX, cY, sc, (nx, ny) => {
    if (ny >= bodyT && ny <= bodyB && Math.abs(nx) <= bodyW) return true
    const d = Math.sqrt(nx * nx + (ny - sCY) ** 2)
    if (d >= sInR && d <= sOutR && ny <= sCY) return true
    const armH = (sOutR - sInR) / 2
    if (ny >= sCY - armH && ny <= bodyT + 0.05) {
      if (Math.abs(Math.abs(nx) - (sInR + armH)) < armH) return true
    }
    return false
  })
}

function hexNetPts(N: number, cX: number, cY: number, sc: number): Pt[] {
  const HEX_R = 0.42
  const HEX_SEP = HEX_R * 1.78
  const centers: Pt[] = [{ x: 0, y: 0 }]
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 6
    centers.push({ x: Math.cos(a) * HEX_SEP, y: Math.sin(a) * HEX_SEP })
  }
  return sampleOrganic(N, cX, cY, sc, (nx, ny) => {
    return centers.some((c) => {
      const q = Math.abs(nx - c.x)
      const r = Math.abs(ny - c.y)
      return q * 0.866 + r * 0.5 <= HEX_R * 0.866
    })
  })
}

// DALA CHROMATIC PALETTE
const DALA_COLORS = [
  "#8052ff", // Electric Iris
  "#8052ff",
  "#ffb829", // Saffron / Amber Spark
  "#15846e", // Deep Teal
  "#e056fd", // Neon Violet / Pink
  "#00d2d3", // Cyber Cyan
  "#00ff87", // Matrix Green
]

const PHASES_METADATA = [
  {
    id: "01",
    code: "NEURAL_MATRIX",
    title: "BRAIN MATRIX",
    subtitle: "Cognitive Security & Pattern Recognition",
    color: "#8052ff",
    accent: "text-[#a57bff]",
    border: "border-[#8052ff]/40",
  },
  {
    id: "02",
    code: "SHIELD_FIREWALL",
    title: "DEFENSE SHIELD",
    subtitle: "Zero-Trust Security & Active Defense",
    color: "#00d2d3",
    accent: "text-[#00ffff]",
    border: "border-[#00d2d3]/40",
  },
  {
    id: "03",
    code: "VULN_RESEARCH",
    title: "THREAT VECTOR",
    subtitle: "Vulnerability Discovery & Bug Bounty Hunting",
    color: "#e056fd",
    accent: "text-[#e056fd]",
    border: "border-[#e056fd]/40",
  },
  {
    id: "04",
    code: "ENCRYPTION_VAULT",
    title: "ENCRYPTION LOCK",
    subtitle: "Access Control & Cryptographic Security",
    color: "#ffb829",
    accent: "text-[#ffd700]",
    border: "border-[#ffb829]/40",
  },
  {
    id: "05",
    code: "INFRA_MESH",
    title: "INFRASTRUCTURE MESH",
    subtitle: "Distributed Systems & API Protocols",
    color: "#00ff87",
    accent: "text-[#00ff87]",
    border: "border-[#00ff87]/40",
  },
]

interface TriangleParticle {
  x: number
  y: number
  targets: Pt[]
  size: number
  color: string
  baseAlpha: number
  alpha: number
  rotation: number
  rotationSpeed: number
  phase: number
}

export default function ScrollConstellation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [activePhaseIndex, setActivePhaseIndex] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    let animId: number
    let W = (canvas.width = window.innerWidth)
    let H = (canvas.height = window.innerHeight)

    let scrollProgress = 0
    let smoothScroll = 0
    let mouseX = -9999
    let mouseY = -9999
    let time = 0

    const N = 850
    const TOTAL_PHASES = 5
    let particles: TriangleParticle[] = []

    const getCenter = () => {
      const isDesktop = W >= 1024
      return {
        cX: isDesktop ? Math.min(W * 0.72, W - 320) : W * 0.5,
        cY: H * 0.5,
      }
    }
    const getScale = () => Math.min(W, H) * (W >= 1024 ? 0.34 : 0.28)

    const buildParticles = () => {
      particles = []
      const { cX, cY } = getCenter()
      const sc = getScale()

      const shapes = [
        brainPts(N, cX, cY, sc),
        shieldPts(N, cX, cY, sc),
        skullPts(N, cX, cY, sc),
        padlockPts(N, cX, cY, sc),
        hexNetPts(N, cX, cY, sc),
      ]

      for (let i = 0; i < N; i++) {
        const color = DALA_COLORS[Math.floor(Math.random() * DALA_COLORS.length)]
        const alpha = Math.random() * 0.6 + 0.35
        particles.push({
          x: shapes[0][i]?.x ?? cX,
          y: shapes[0][i]?.y ?? cY,
          targets: shapes.map((s) => s[i] ?? { x: cX, y: cY }),
          size: Math.random() * 2.4 + 1.2,
          color,
          baseAlpha: alpha,
          alpha,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          phase: Math.random() * Math.PI * 2,
        })
      }
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
    const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)

    // Fast triangle drawing (Dala signature outlined triangle with inner core fill)
    const drawTriangle = (
      x: number,
      y: number,
      size: number,
      rotation: number,
      color: string,
      alpha: number
    ) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)
      ctx.globalAlpha = clamp(alpha, 0, 1)

      const h = size * 1.6
      const halfW = size * 0.95

      ctx.strokeStyle = color
      ctx.lineWidth = 1.0
      ctx.beginPath()
      ctx.moveTo(0, -h / 2)
      ctx.lineTo(-halfW, h / 2)
      ctx.lineTo(halfW, h / 2)
      ctx.closePath()
      ctx.stroke()

      ctx.fillStyle = color
      ctx.globalAlpha = clamp(alpha * 0.35, 0, 1)
      ctx.fill()
      ctx.restore()
    }

    const render = () => {
      time += 0.009
      smoothScroll += (scrollProgress - smoothScroll) * 0.065
      ctx.clearRect(0, 0, W, H)

      const s = smoothScroll
      const PHASE_W = 1 / TOTAL_PHASES
      const rawPhase = s / PHASE_W
      const phaseIdx = clamp(Math.floor(rawPhase), 0, TOTAL_PHASES - 1)
      const blendT = easeInOut(clamp(rawPhase - phaseIdx, 0, 1))

      setActivePhaseIndex(phaseIdx)

      // Draw Dala neural connections between nearby particles
      const maxConnDist = 32
      ctx.lineWidth = 0.45
      for (let i = 0; i < particles.length; i += 4) {
        const p1 = particles[i]
        for (let j = i + 1; j < particles.length; j += 5) {
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < maxConnDist) {
            const lineAlpha = (1 - dist / maxConnDist) * 0.16 * p1.alpha
            ctx.strokeStyle = p1.color
            ctx.globalAlpha = lineAlpha
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      // Update & render Dala triangle particles
      particles.forEach((p) => {
        p.rotation += p.rotationSpeed

        const curTarget = p.targets[phaseIdx]
        const nxtTarget = p.targets[Math.min(phaseIdx + 1, TOTAL_PHASES - 1)]

        let tx = lerp(curTarget.x, nxtTarget.x, blendT)
        let ty = lerp(curTarget.y, nxtTarget.y, blendT)

        const floatAmp = lerp(2.8, 0.8, blendT)
        tx += Math.sin(time * 1.1 + p.phase) * floatAmp
        ty += Math.cos(time * 1.1 + p.phase + 1.2) * floatAmp

        if (phaseIdx === 0) {
          const mdx = mouseX - p.x, mdy = mouseY - p.y
          const md = Math.sqrt(mdx * mdx + mdy * mdy)
          if (md < 120 && md > 0) {
            const f = (120 - md) / 120
            tx -= (mdx / md) * f * 38
            ty -= (mdy / md) * f * 38
          }
        }

        const speed = lerp(0.085, 0.06, blendT)
        p.x += (tx - p.x) * speed
        p.y += (ty - p.y) * speed

        p.alpha = clamp(p.baseAlpha * (0.82 + 0.18 * Math.sin(time * 2.4 + p.phase)), 0.1, 1)

        drawTriangle(p.x, p.y, p.size * 3.0, p.rotation, p.color, p.alpha)
      })

      animId = requestAnimationFrame(render)
    }

    const onResize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
      buildParticles()
    }

    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight
      scrollProgress = docH > 0 ? clamp(window.scrollY / docH, 0, 1) : 0
    }

    buildParticles()
    render()

    window.addEventListener("resize", onResize)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    })

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  const currentMeta = PHASES_METADATA[activePhaseIndex] || PHASES_METADATA[0]

  return (
    <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />
  )
}
