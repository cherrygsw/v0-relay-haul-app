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
  Zap,
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
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {"What's Next?"}
          </h1>
          <Badge className="bg-success/8 text-success ring-1 ring-success/20 border-0 text-[10px] font-bold uppercase tracking-wider">
            Leg 1 Complete
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          AI has analyzed nearby loads and your home route
        </p>
      </div>

      {/* Current Status */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-4 w-4 rounded-full bg-success ring-2 ring-primary/5" />
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                Currently in {currentLocation}
              </p>
              <p className="text-xs text-muted-foreground">
                {driver.hosRemainingHours}h HOS remaining &middot; Home is{" "}
                {homeMiles} mi away in {driver.homeCity}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs font-semibold text-primary">
              {driver.hosRemainingHours}h drive time left
            </span>
          </div>
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-card/60 p-6">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 glow-sm-primary">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-bold text-gradient">AI Recommendation</p>
              <Badge className="bg-primary/8 text-primary ring-1 ring-primary/20 border-0 text-[9px] font-bold">
                Stay on Road
              </Badge>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              There{"'"}s a <span className="font-bold text-foreground">$945 load to St. Louis</span> picking up in 2 hours — that{"'"}s{" "}
              <span className="font-bold text-primary">$3.50/mi</span>, well above market rate.
              Your home in Denver is 670 miles west, and the only homebound load pays $795 for 265 miles through Omaha.
              Grab the St. Louis run, then catch a westbound load tomorrow morning.
            </p>
          </div>
        </div>
      </div>

      {/* Two Options */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Drive Home */}
        <div
          className={cn(
            "group relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300",
            choice === "HOME"
              ? "border-primary/40 glow-primary"
              : "border-border/40 hover:border-border/60"
          )}
          onClick={() => setChoice("HOME")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setChoice("HOME")}
        >
          <div className={cn(
            "absolute top-0 left-0 right-0 h-px transition-opacity",
            choice === "HOME"
              ? "bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-100"
              : "bg-gradient-to-r from-transparent via-border/40 to-transparent opacity-0 group-hover:opacity-100"
          )} />
          <div className="bg-card/60 p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/60 ring-1 ring-border/30">
                <Home className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-2">
                {choice === "HOME" && (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Drive Home</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Pick up a load heading toward {driver.homeCity}
              </p>
            </div>

            {/* Load Card */}
            <div className="rounded-xl bg-secondary/30 border border-border/30 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">
                    {homeLoad.origin} → {homeLoad.destination}
                  </span>
                </div>
                <span className="text-lg font-bold text-foreground">
                  ${(homeLoad.rateCents / 100).toLocaleString()}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { icon: ArrowRight, value: `${homeLoad.miles} mi`, label: "Distance" },
                  { icon: DollarSign, value: `$${(homeLoad.rateCents / 100 / homeLoad.miles).toFixed(2)}/mi`, label: "Rate" },
                  { icon: Clock, value: homeLoad.pickupTime, label: "Pickup" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-0.5">
                    <item.icon className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-bold text-foreground">{item.value}</span>
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
        </div>

        {/* Stay on Road */}
        <div
          className={cn(
            "group relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300",
            choice === "STAY"
              ? "border-primary/40 glow-primary"
              : !choice
              ? "border-primary/20 glow-sm-primary"
              : "border-border/40 hover:border-border/60"
          )}
          onClick={() => setChoice("STAY")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setChoice("STAY")}
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          <div className="bg-card/60 p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div className="flex items-center gap-2">
                {!choice && (
                  <Badge className="bg-primary/8 text-primary ring-1 ring-primary/20 border-0 text-[9px] font-bold uppercase tracking-wider">
                    Recommended
                  </Badge>
                )}
                {choice === "STAY" && (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Stay on the Road</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                High-pay load available nearby
              </p>
            </div>

            {/* Load Card */}
            <div className="rounded-xl bg-primary/5 border border-primary/15 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="h-3.5 w-3.5 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    {stayLoad.origin} → {stayLoad.destination}
                  </span>
                </div>
                <span className="text-lg font-bold text-primary">
                  ${(stayLoad.rateCents / 100).toLocaleString()}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { icon: ArrowRight, value: `${stayLoad.miles} mi`, label: "Distance" },
                  { icon: DollarSign, value: `$${(stayLoad.rateCents / 100 / stayLoad.miles).toFixed(2)}/mi`, label: "Rate", highlight: true },
                  { icon: Clock, value: stayLoad.pickupTime, label: "Pickup" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-0.5">
                    <item.icon className={cn("h-3 w-3", "highlight" in item && item.highlight ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-xs font-bold", "highlight" in item && item.highlight ? "text-primary" : "text-foreground")}>{item.value}</span>
                    <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-primary shrink-0" />
              <span><span className="font-bold text-primary">$3.50/mi</span> — 40% above average corridor rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Confirmation */}
      {choice && (
        <div className="relative overflow-hidden flex flex-col items-center gap-4 rounded-2xl border border-success/20 bg-success/5 p-8">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-success/50 to-transparent" />
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 ring-1 ring-success/20 glow-success">
            <CheckCircle2 className="h-6 w-6 text-success" />
          </div>
          <p className="text-center text-sm font-semibold text-foreground">
            {choice === "HOME"
              ? `Accepted the ${homeLoad.origin} → ${homeLoad.destination} load. Head to pickup.`
              : `Accepted the ${stayLoad.origin} → ${stayLoad.destination} load. Pickup at 3:00 PM today.`}
          </p>
          <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setChoice(null)}>
            Change Decision
          </Button>
        </div>
      )}

      {/* All Nearby Loads */}
      <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/60">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-foreground">All Nearby Loads</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{NEARBY_LOADS.length} loads within range of {currentLocation}</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-secondary/40 px-3 py-1.5 ring-1 ring-border/30">
              <Zap className="h-3 w-3 text-primary" />
              <span className="text-xs font-semibold text-foreground">{NEARBY_LOADS.length}</span>
              <span className="text-xs text-muted-foreground">loads</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {NEARBY_LOADS.map((load) => (
              <div
                key={load.id}
                className="group flex items-center justify-between rounded-xl border border-border/30 bg-secondary/20 p-4 transition-all hover:border-primary/20 hover:bg-secondary/30"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-foreground">
                    {load.origin} → {load.destination}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {load.miles} mi &middot; {load.direction} &middot; {load.pickupTime}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-foreground">
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
