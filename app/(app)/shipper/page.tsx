"use client"

import { useState } from "react"
import {
  MapPin,
  ArrowRight,
  Send,
  Loader2,
  Package,
  Truck,
  DollarSign,
  Route,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { RouteVisualizer } from "@/components/route-visualizer"
import { DEMO_LOAD } from "@/lib/mock-data"

export default function ShipperPortalPage() {
  const [origin, setOrigin] = useState("Chicago, IL")
  const [destination, setDestination] = useState("Los Angeles, CA")
  const [submitted, setSubmitted] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1500)
  }

  const load = DEMO_LOAD
  const totalRate = load.legs.reduce((sum, leg) => sum + leg.rateCents, 0)
  const assignedLegs = load.legs.filter(
    (l) => l.status === "ASSIGNED" || l.status === "IN_TRANSIT" || l.status === "COMPLETED"
  ).length

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Shipper Portal
        </p>
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-3xl font-medium text-foreground lg:text-4xl">
            Submit a Load
          </h1>
          <Badge className="rounded-full bg-primary/10 text-primary border-0 text-[10px] font-semibold">
            AI Dispatch
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Enter your route and watch AI build your relay chain in real time
        </p>
      </div>

      {/* Load Submission */}
      <div className="rounded-2xl border border-border bg-card p-7">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
            <Package className="h-4.5 w-4.5 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Load Details</h2>
            <p className="text-xs text-muted-foreground">AI segments the route into HOS-legal relay legs</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-2 block text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">
              Origin
            </label>
            <Input
              placeholder="Chicago, IL"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="h-11 rounded-xl border-border bg-secondary/40 focus:border-primary"
            />
          </div>
          <div className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary">
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <label className="mb-2 block text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">
              Destination
            </label>
            <Input
              placeholder="Los Angeles, CA"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="h-11 rounded-xl border-border bg-secondary/40 focus:border-primary"
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={loading || !origin || !destination}
            className="gap-2 h-11 rounded-full px-7 shrink-0 bg-foreground text-background hover:bg-foreground/90"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Segmenting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Load
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Results */}
      {submitted && (
        <>
          {/* Summary Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Route, value: load.miles.toLocaleString(), unit: "mi", label: "Total Miles" },
              { icon: Truck, value: String(load.legs.length), unit: "legs", label: "Relay Legs" },
              { icon: MapPin, value: `${assignedLegs}/${load.legs.length}`, unit: "", label: "Assigned" },
              { icon: DollarSign, value: `$${(totalRate / 100).toLocaleString()}`, unit: "", label: "Est. Cost" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                    <stat.icon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">
                    {stat.label}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-3xl font-medium text-foreground">{stat.value}</span>
                  {stat.unit && <span className="text-sm text-muted-foreground">{stat.unit}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Relay Chain */}
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            {/* Main Chain View */}
            <div className="rounded-2xl border border-border bg-card">
              <div className="p-7">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h2 className="font-serif text-xl font-medium text-foreground">Relay Chain</h2>
                    <span className="font-mono text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                      {load.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Sparkles className="h-3 w-3 text-primary" />
                    {load.origin} {">"} {load.destination}
                  </div>
                </div>

                {/* Route Map */}
                <div className="mb-6 rounded-xl overflow-hidden border border-border bg-secondary/30 p-4">
                  <RouteMap />
                </div>

                {/* Legs Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        {["Leg", "Route", "Miles", "Driver", "Status"].map((h) => (
                          <th key={h} className="pb-3 pr-4 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {load.legs.map((leg) => (
                        <tr key={leg.id} className="border-b border-border/60 hover:bg-secondary/30 transition-colors">
                          <td className="py-4 pr-4">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-serif font-semibold text-foreground">
                              {leg.sequence}
                            </span>
                          </td>
                          <td className="py-4 pr-4 font-medium text-foreground">
                            {leg.origin}
                            <span className="mx-1.5 text-muted-foreground/40">{">"}</span>
                            {leg.destination}
                          </td>
                          <td className="py-4 pr-4 font-mono text-muted-foreground">
                            {leg.miles}
                          </td>
                          <td className="py-4 pr-4">
                            {leg.driverName ? (
                              <span className="inline-flex items-center text-foreground text-xs font-medium bg-secondary px-2.5 py-1 rounded-full">
                                {leg.driverName}
                              </span>
                            ) : (
                              <span className="text-muted-foreground/40 italic text-xs">Unassigned</span>
                            )}
                          </td>
                          <td className="py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                                leg.status === "IN_TRANSIT"
                                  ? "bg-success/10 text-success"
                                  : leg.status === "ASSIGNED"
                                  ? "bg-primary/10 text-primary"
                                  : leg.status === "SEARCHING"
                                  ? "bg-warning/10 text-warning"
                                  : "bg-secondary text-muted-foreground"
                              }`}
                            >
                              <span className="relative flex h-1.5 w-1.5">
                                {(leg.status === "IN_TRANSIT" || leg.status === "SEARCHING") && (
                                  <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                                    leg.status === "IN_TRANSIT" ? "bg-success" : "bg-warning"
                                  }`} />
                                )}
                                <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                                  leg.status === "IN_TRANSIT" ? "bg-success"
                                  : leg.status === "ASSIGNED" ? "bg-primary"
                                  : leg.status === "SEARCHING" ? "bg-warning"
                                  : "bg-muted-foreground"
                                }`} />
                              </span>
                              {leg.status === "IN_TRANSIT" ? "In Transit"
                                : leg.status === "ASSIGNED" ? "Assigned"
                                : leg.status === "SEARCHING" ? "Searching"
                                : "Waiting"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Timeline Sidebar */}
            <div className="rounded-2xl border border-border bg-card h-fit">
              <div className="p-7">
                <div className="mb-6">
                  <h2 className="font-serif text-xl font-medium text-foreground">Live Timeline</h2>
                  <p className="text-xs text-muted-foreground mt-1">Real-time relay chain status</p>
                </div>
                <RouteVisualizer legs={load.legs} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function RouteMap() {
  const cities = [
    { name: "Chicago", x: 75, y: 28 },
    { name: "Iowa City", x: 55, y: 30 },
    { name: "N. Platte", x: 32, y: 32 },
    { name: "Barstow", x: 10, y: 55 },
    { name: "Los Angeles", x: 5, y: 62 },
  ]

  const segmentColors = [
    { stroke: "oklch(0.52 0.12 40)", status: "active" },
    { stroke: "oklch(0.6 0.1 160)", status: "active" },
    { stroke: "oklch(0.7 0.14 70)", status: "searching" },
    { stroke: "oklch(0.5 0.02 60)", status: "waiting" },
  ]

  return (
    <div className="relative">
      <svg viewBox="0 0 100 80" className="w-full h-auto" style={{ minHeight: "200px" }}>
        {/* Grid lines */}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 16} x2="100" y2={i * 16}
            stroke="oklch(0.88 0.01 75 / 0.6)" strokeWidth="0.15" />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <line key={`v${i}`} x1={i * 14} y1="0" x2={i * 14} y2="80"
            stroke="oklch(0.88 0.01 75 / 0.6)" strokeWidth="0.15" />
        ))}

        {/* Route segments */}
        {cities.slice(0, -1).map((city, i) => {
          const next = cities[i + 1]
          const color = segmentColors[i]
          return (
            <g key={i}>
              <line
                x1={city.x} y1={city.y} x2={next.x} y2={next.y}
                stroke={color.stroke}
                strokeWidth={color.status === "active" ? "0.8" : "0.5"}
                strokeDasharray={color.status !== "active" ? "2,1.5" : "none"}
                opacity={color.status === "active" ? 0.7 : 0.35}
                strokeLinecap="round"
              />
            </g>
          )
        })}

        {/* City nodes */}
        {cities.map((city, i) => {
          const isEndpoint = i === 0 || i === cities.length - 1
          const color = i === 0
            ? segmentColors[0].stroke
            : i === cities.length - 1
            ? "oklch(0.6 0.16 155)"
            : segmentColors[Math.min(i, segmentColors.length - 1)].stroke
          return (
            <g key={city.name}>
              <circle cx={city.x} cy={city.y} r={isEndpoint ? 3.5 : 2.5}
                fill="none" stroke={color} strokeWidth="0.3" opacity="0.4" />
              <circle cx={city.x} cy={city.y} r={isEndpoint ? 2 : 1.5}
                fill={color} opacity="0.9" />
              <text
                x={city.x} y={city.y + (isEndpoint ? 7 : 6)}
                textAnchor="middle" fontSize="2.8" fontWeight="600"
                fill="oklch(0.5 0.02 60)" fontFamily="system-ui"
              >
                {city.name}
              </text>
            </g>
          )
        })}

        {/* Animated truck dot */}
        <circle r="1.8" fill="oklch(0.52 0.12 40)" opacity="0.9">
          <animate attributeName="cx" from="73" to="57" dur="4s" repeatCount="indefinite" />
          <animate attributeName="cy" from="28.5" to="30" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle r="4" fill="oklch(0.52 0.12 40)" opacity="0.1">
          <animate attributeName="cx" from="73" to="57" dur="4s" repeatCount="indefinite" />
          <animate attributeName="cy" from="28.5" to="30" dur="4s" repeatCount="indefinite" />
          <animate attributeName="r" from="3" to="5" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.15" to="0" dur="1.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  )
}
