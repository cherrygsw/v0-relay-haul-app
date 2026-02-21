"use client"

import { useEffect, useRef } from "react"

const CITIES = [
  { name: "Chicago", x: 0.72, y: 0.28, abbr: "CHI" },
  { name: "Iowa City", x: 0.56, y: 0.30, abbr: "IC" },
  { name: "N. Platte", x: 0.35, y: 0.32, abbr: "NP" },
  { name: "Barstow", x: 0.12, y: 0.55, abbr: "BAR" },
  { name: "Los Angeles", x: 0.06, y: 0.62, abbr: "LA" },
]

const LEG_COLORS = [
  { r: 230, g: 160, b: 60 },    // amber
  { r: 80, g: 200, b: 160 },     // teal
  { r: 200, g: 100, b: 60 },     // copper
  { r: 100, g: 160, b: 220 },    // blue
]

export function HeroRouteAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener("resize", resize)

    const draw = () => {
      const w = canvas.getBoundingClientRect().width
      const h = canvas.getBoundingClientRect().height
      ctx.clearRect(0, 0, w, h)
      time += 0.004

      // Draw grid
      ctx.strokeStyle = "rgba(80, 90, 120, 0.08)"
      ctx.lineWidth = 1
      const gridSize = 40
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      const cities = CITIES.map(c => ({
        ...c,
        px: c.x * w,
        py: c.y * h,
      }))

      // Draw route segments with glow
      for (let i = 0; i < cities.length - 1; i++) {
        const from = cities[i]
        const to = cities[i + 1]
        const color = LEG_COLORS[i]

        // Glow
        ctx.save()
        ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.3)`
        ctx.shadowBlur = 20
        ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.4)`
        ctx.lineWidth = 3
        ctx.beginPath()

        // Curved path
        const midX = (from.px + to.px) / 2
        const midY = (from.py + to.py) / 2 - 30
        ctx.moveTo(from.px, from.py)
        ctx.quadraticCurveTo(midX, midY, to.px, to.py)
        ctx.stroke()
        ctx.restore()

        // Solid line
        ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.6)`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(from.px, from.py)
        ctx.quadraticCurveTo(midX, midY, to.px, to.py)
        ctx.stroke()

        // Animated pulse along path
        const progress = (time * (1 + i * 0.3)) % 1
        const t = progress
        const pulseX = (1-t)*(1-t)*from.px + 2*(1-t)*t*midX + t*t*to.px
        const pulseY = (1-t)*(1-t)*from.py + 2*(1-t)*t*midY + t*t*to.py

        ctx.save()
        ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`
        ctx.shadowBlur = 15
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.9)`
        ctx.beginPath()
        ctx.arc(pulseX, pulseY, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // Draw city nodes
      cities.forEach((city, i) => {
        const isEndpoint = i === 0 || i === cities.length - 1
        const color = i === 0 ? LEG_COLORS[0] : i === cities.length - 1 ? { r: 80, g: 200, b: 120 } : LEG_COLORS[Math.min(i, LEG_COLORS.length - 1)]

        // Outer ring pulse
        const pulse = Math.sin(time * 3 + i) * 0.3 + 0.7
        ctx.save()
        ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.2 * pulse})`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(city.px, city.py, isEndpoint ? 16 : 12, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()

        // Node
        ctx.save()
        ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`
        ctx.shadowBlur = 12
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.9)`
        ctx.beginPath()
        ctx.arc(city.px, city.py, isEndpoint ? 7 : 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        // Label
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`
        ctx.font = `600 ${isEndpoint ? 11 : 10}px system-ui, sans-serif`
        ctx.textAlign = "center"
        ctx.fillText(city.name, city.px, city.py + (isEndpoint ? 26 : 22))
      })

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.7 }}
    />
  )
}
