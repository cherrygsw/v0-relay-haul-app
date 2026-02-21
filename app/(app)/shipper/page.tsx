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
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
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
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
          Shipper Portal
        </h1>
        <p className="mt-1 text-muted-foreground">
          Submit a load and watch the AI build your relay chain
        </p>
      </div>

      {/* Load Submission */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Submit Load
          </CardTitle>
          <CardDescription>
            Enter origin and destination. AI will segment the route into
            HOS-legal relay legs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Origin
              </label>
              <Input
                placeholder="Chicago, IL"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
            </div>
            <ArrowRight className="hidden h-5 w-5 shrink-0 text-muted-foreground sm:block" />
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Destination
              </label>
              <Input
                placeholder="Los Angeles, CA"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <Button
              onClick={handleSubmit}
              disabled={loading || !origin || !destination}
              className="gap-2 sm:w-auto"
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
        </CardContent>
      </Card>

      {/* Results */}
      {submitted && (
        <>
          {/* Summary Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Route className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {load.miles.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Miles</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {load.legs.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Relay Legs</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10">
                  <MapPin className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {assignedLegs}/{load.legs.length}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Drivers Assigned
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warning/10">
                  <DollarSign className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    ${(totalRate / 100).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Est. Total Cost
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Relay Chain */}
          <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
            {/* Route Map Placeholder - Visual Route Display */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Relay Chain</CardTitle>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {load.id}
                  </Badge>
                </div>
                <CardDescription>
                  {load.origin} → {load.destination}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Route Visualization */}
                <div className="mb-6 rounded-xl border border-border bg-secondary/30 p-4 overflow-hidden">
                  <RouteMap />
                </div>

                {/* Legs Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                          Leg
                        </th>
                        <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                          Route
                        </th>
                        <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                          Miles
                        </th>
                        <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                          Driver
                        </th>
                        <th className="pb-2 text-xs font-medium text-muted-foreground">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {load.legs.map((leg) => (
                        <tr key={leg.id} className="border-b border-border/50">
                          <td className="py-3 pr-4 font-bold text-primary">
                            #{leg.sequence}
                          </td>
                          <td className="py-3 pr-4 text-foreground">
                            {leg.origin} → {leg.destination}
                          </td>
                          <td className="py-3 pr-4 font-mono text-muted-foreground">
                            {leg.miles}
                          </td>
                          <td className="py-3 pr-4">
                            {leg.driverName ? (
                              <span className="text-foreground">
                                {leg.driverName}
                              </span>
                            ) : (
                              <span className="text-muted-foreground italic">
                                --
                              </span>
                            )}
                          </td>
                          <td className="py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                                leg.status === "IN_TRANSIT"
                                  ? "bg-success/15 text-success"
                                  : leg.status === "ASSIGNED"
                                  ? "bg-primary/15 text-primary"
                                  : leg.status === "SEARCHING"
                                  ? "bg-warning/15 text-warning"
                                  : "bg-secondary text-muted-foreground"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  leg.status === "IN_TRANSIT"
                                    ? "bg-success animate-pulse"
                                    : leg.status === "ASSIGNED"
                                    ? "bg-primary"
                                    : leg.status === "SEARCHING"
                                    ? "bg-warning animate-pulse"
                                    : "bg-muted-foreground"
                                }`}
                              />
                              {leg.status === "IN_TRANSIT"
                                ? "In Transit"
                                : leg.status === "ASSIGNED"
                                ? "Assigned"
                                : leg.status === "SEARCHING"
                                ? "Searching..."
                                : "Waiting"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Timeline Sidebar */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Live Timeline</CardTitle>
                <CardDescription>
                  Real-time relay chain status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RouteVisualizer legs={load.legs} />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

function RouteMap() {
  const cities = [
    { name: "Chicago", x: 75, y: 30 },
    { name: "Iowa City", x: 55, y: 32 },
    { name: "North Platte", x: 32, y: 33 },
    { name: "Barstow", x: 10, y: 58 },
    { name: "Los Angeles", x: 5, y: 63 },
  ]

  const colors = ["#e87a3a", "#3ab4a0", "#d95050", "#c4a83a"]

  return (
    <div className="relative">
      <svg
        viewBox="0 0 100 80"
        className="w-full h-auto"
        style={{ minHeight: "180px" }}
      >
        {/* Route segments */}
        {cities.slice(0, -1).map((city, i) => {
          const next = cities[i + 1]
          return (
            <line
              key={i}
              x1={city.x}
              y1={city.y}
              x2={next.x}
              y2={next.y}
              stroke={colors[i]}
              strokeWidth="0.8"
              strokeDasharray={i >= 2 ? "2,1" : "none"}
              opacity={i >= 2 ? 0.5 : 0.9}
            />
          )
        })}

        {/* City dots */}
        {cities.map((city, i) => (
          <g key={city.name}>
            <circle
              cx={city.x}
              cy={city.y}
              r="2"
              fill={
                i === 0
                  ? colors[0]
                  : i === cities.length - 1
                  ? "#4ade80"
                  : colors[Math.min(i, colors.length - 1)]
              }
              opacity="0.9"
            />
            <circle
              cx={city.x}
              cy={city.y}
              r="3.5"
              fill="none"
              stroke={
                i === 0
                  ? colors[0]
                  : i === cities.length - 1
                  ? "#4ade80"
                  : colors[Math.min(i, colors.length - 1)]
              }
              strokeWidth="0.3"
              opacity="0.4"
            />
            <text
              x={city.x}
              y={city.y + 6}
              textAnchor="middle"
              className="fill-muted-foreground"
              fontSize="3"
              fontFamily="system-ui"
            >
              {city.name}
            </text>
          </g>
        ))}

        {/* Truck icon on leg 1 */}
        <circle cx={65} cy={31} r="2.5" fill={colors[0]} opacity="0.8">
          <animate
            attributeName="cx"
            from="73"
            to="57"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  )
}
