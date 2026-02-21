"use client"

import { useState } from "react"
import {
  Home,
  Truck,
  Sparkles,
  MapPin,
  DollarSign,
  Clock,
  ArrowRight,
  CheckCircle2,
  Navigation,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DEMO_DRIVERS, NEARBY_LOADS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const driver = DEMO_DRIVERS[0]
const currentLocation = "Iowa City, IA"
const homeMiles = 670

const homeLoad = NEARBY_LOADS[0]
const stayLoad = NEARBY_LOADS[2]

export default function WhatsNextPage() {
  const [choice, setChoice] = useState<"HOME" | "STAY" | null>(null)

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Decision Engine
        </p>
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-3xl font-medium text-foreground lg:text-4xl">
            {"What's Next?"}
          </h1>
          <Badge className="rounded-full bg-success/10 text-success border-0 text-[10px] font-semibold">
            Leg 1 Complete
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          AI has analyzed nearby loads and your home route
        </p>
      </div>

      {/* Current Status */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-4 w-4 rounded-full bg-success ring-2 ring-card" />
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Currently in {currentLocation}
              </p>
              <p className="text-xs text-muted-foreground">
                {driver.hosRemainingHours}h HOS remaining &middot; Home is{" "}
                {homeMiles} mi away in {driver.homeCity}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-foreground">
              {driver.hosRemainingHours}h drive time left
            </span>
          </div>
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-semibold text-primary">AI Recommendation</p>
              <Badge className="rounded-full bg-primary/10 text-primary border-0 text-[9px] font-semibold">
                Stay on Road
              </Badge>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              There{"'"}s a <span className="font-semibold text-foreground">$945 load to St. Louis</span> picking up in 2 hours — that{"'"}s{" "}
              <span className="font-semibold text-primary">$3.50/mi</span>, well above market rate.
              Your home in Denver is 670 miles west, and the only homebound load pays $795 for 265 miles through Omaha.
              Grab the St. Louis run, then catch a westbound load tomorrow morning.
            </p>
          </div>
        </div>
      </div>

      {/* Two Options */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Drive Home */}
        <button
          className={cn(
            "group text-left relative overflow-hidden rounded-2xl border transition-all duration-300",
            choice === "HOME"
              ? "border-primary/40 shadow-lg shadow-primary/5 -translate-y-0.5"
              : "border-border hover:border-border/80 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-0.5"
          )}
          onClick={() => setChoice("HOME")}
        >
          <div className="bg-card p-7 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <Home className="h-5 w-5 text-muted-foreground" />
              </div>
              {choice === "HOME" && (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <h3 className="font-serif text-xl font-medium text-foreground">Drive Home</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Pick up a load heading toward {driver.homeCity}
              </p>
            </div>

            <div className="rounded-xl bg-secondary/60 border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Navigation className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">
                    {homeLoad.origin} {">"} {homeLoad.destination}
                  </span>
                </div>
                <span className="font-serif text-xl font-medium text-foreground">
                  ${(homeLoad.rateCents / 100).toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: ArrowRight, value: `${homeLoad.miles} mi`, label: "Distance" },
                  { icon: DollarSign, value: `$${(homeLoad.rateCents / 100 / homeLoad.miles).toFixed(2)}/mi`, label: "Rate" },
                  { icon: Clock, value: homeLoad.pickupTime, label: "Pickup" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-0.5">
                    <item.icon className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-semibold text-foreground">{item.value}</span>
                    <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              {homeLoad.direction}
            </div>
          </div>
        </button>

        {/* Stay on Road */}
        <button
          className={cn(
            "group text-left relative overflow-hidden rounded-2xl border transition-all duration-300",
            choice === "STAY"
              ? "border-primary/40 shadow-lg shadow-primary/5 -translate-y-0.5"
              : !choice
              ? "border-primary/20 shadow-md shadow-primary/5"
              : "border-border hover:border-border/80 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-0.5"
          )}
          onClick={() => setChoice("STAY")}
        >
          <div className="bg-card p-7 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div className="flex items-center gap-2">
                {!choice && (
                  <Badge className="rounded-full bg-primary/10 text-primary border-0 text-[9px] font-semibold">
                    Recommended
                  </Badge>
                )}
                {choice === "STAY" && (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                )}
              </div>
            </div>
            <div>
              <h3 className="font-serif text-xl font-medium text-foreground">Stay on the Road</h3>
              <p className="text-xs text-muted-foreground mt-1">
                High-pay load available nearby
              </p>
            </div>

            <div className="rounded-xl bg-primary/5 border border-primary/15 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Navigation className="h-3.5 w-3.5 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    {stayLoad.origin} {">"} {stayLoad.destination}
                  </span>
                </div>
                <span className="font-serif text-xl font-medium text-primary">
                  ${(stayLoad.rateCents / 100).toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: ArrowRight, value: `${stayLoad.miles} mi`, label: "Distance" },
                  { icon: DollarSign, value: `$${(stayLoad.rateCents / 100 / stayLoad.miles).toFixed(2)}/mi`, label: "Rate", highlight: true },
                  { icon: Clock, value: stayLoad.pickupTime, label: "Pickup" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-0.5">
                    <item.icon className={cn("h-3 w-3", "highlight" in item && item.highlight ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-xs font-semibold", "highlight" in item && item.highlight ? "text-primary" : "text-foreground")}>{item.value}</span>
                    <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-primary shrink-0" />
              <span><span className="font-semibold text-primary">$3.50/mi</span> — 40% above average corridor rate</span>
            </div>
          </div>
        </button>
      </div>

      {/* Action Confirmation */}
      {choice && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-success/20 bg-success/5 p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-6 w-6 text-success" />
          </div>
          <p className="text-center text-sm font-medium text-foreground">
            {choice === "HOME"
              ? `Accepted the ${homeLoad.origin} > ${homeLoad.destination} load. Head to pickup.`
              : `Accepted the ${stayLoad.origin} > ${stayLoad.destination} load. Pickup at 3:00 PM today.`}
          </p>
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => setChoice(null)}>
            Change Decision
          </Button>
        </div>
      )}

      {/* All Nearby Loads */}
      <div className="rounded-2xl border border-border bg-card">
        <div className="p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-xl font-medium text-foreground">All Nearby Loads</h2>
              <p className="text-xs text-muted-foreground mt-1">{NEARBY_LOADS.length} loads within range of {currentLocation}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{NEARBY_LOADS.length}</span> loads
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {NEARBY_LOADS.map((load) => (
              <div
                key={load.id}
                className="group flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-5 transition-all hover:bg-secondary/50 hover:shadow-sm"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-foreground">
                    {load.origin} {">"} {load.destination}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {load.miles} mi &middot; {load.direction} &middot; {load.pickupTime}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-serif text-lg font-medium text-foreground">
                    ${(load.rateCents / 100).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    ${(load.rateCents / 100 / load.miles).toFixed(2)}/mi
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
