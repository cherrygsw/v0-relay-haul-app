"use client"

import { useState } from "react"
import {
  Home,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"
import { DEMO_DRIVERS, NEARBY_LOADS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const driver = DEMO_DRIVERS[0]
const currentLocation = "Iowa City, IA"
const homeMiles = 670

const homeLoad = NEARBY_LOADS[0]
const stayLoad = NEARBY_LOADS[2]

const recommended: "HOME" | "STAY" = "STAY"

export default function WhatsNextPage() {
  const [choice, setChoice] = useState<"HOME" | "STAY" | null>(null)

  return (
    <div className="flex flex-col gap-6">
      {/* Location + HOS strip */}
      <div className="flex items-center justify-between rounded-2xl bg-card border border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{currentLocation}</p>
            <p className="text-xs text-muted-foreground">Home: {driver.homeCity} ({homeMiles} mi)</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
          <Clock className="h-3.5 w-3.5 text-success" />
          <span className="text-sm font-bold text-success tabular-nums">{driver.hosRemainingHours}h</span>
        </div>
      </div>

      {/* Two big tap-target cards */}
      <div className="flex flex-col gap-4">
        {/* STAY on the Road - Recommended */}
        <button
          onClick={() => setChoice("STAY")}
          className={cn(
            "w-full text-left rounded-2xl border-2 transition-colors p-5 min-h-[56px]",
            choice === "STAY"
              ? "border-success bg-success/10"
              : recommended === "STAY" && !choice
              ? "border-success/50 bg-success/5"
              : "border-border bg-card active:bg-secondary"
          )}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl",
                recommended === "STAY" ? "bg-success/20" : "bg-secondary"
              )}>
                <Truck className={cn("h-6 w-6", recommended === "STAY" ? "text-success" : "text-muted-foreground")} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">STAY</p>
                <p className="text-xs text-muted-foreground">Keep earning on the road</p>
              </div>
            </div>
            {recommended === "STAY" && !choice && (
              <span className="rounded-lg bg-success/20 text-success text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
                Best move
              </span>
            )}
            {choice === "STAY" && (
              <CheckCircle2 className="h-6 w-6 text-success" />
            )}
          </div>

          {/* Load preview */}
          <div className="rounded-xl bg-background/50 border border-border p-4 mb-3">
            <p className="text-sm font-bold text-foreground mb-2">
              {stayLoad.origin} <span className="text-muted-foreground font-normal mx-1">{">"}</span> {stayLoad.destination}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-foreground font-bold tabular-nums">{stayLoad.miles} mi</span>
              <span className="text-sm text-success font-bold tabular-nums">${(stayLoad.rateCents / 100).toLocaleString()}</span>
              <span className="text-sm text-primary font-bold tabular-nums">${(stayLoad.rateCents / 100 / stayLoad.miles).toFixed(2)}/mi</span>
              <span className="text-xs text-muted-foreground ml-auto">{stayLoad.pickupTime}</span>
            </div>
          </div>
        </button>

        {/* Drive HOME */}
        <button
          onClick={() => setChoice("HOME")}
          className={cn(
            "w-full text-left rounded-2xl border-2 transition-colors p-5 min-h-[56px]",
            choice === "HOME"
              ? "border-success bg-success/10"
              : "border-border bg-card active:bg-secondary"
          )}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                <Home className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">HOME</p>
                <p className="text-xs text-muted-foreground">Head toward {driver.homeCity}</p>
              </div>
            </div>
            {choice === "HOME" && (
              <CheckCircle2 className="h-6 w-6 text-success" />
            )}
          </div>

          {/* Load preview */}
          <div className="rounded-xl bg-background/50 border border-border p-4 mb-3">
            <p className="text-sm font-bold text-foreground mb-2">
              {homeLoad.origin} <span className="text-muted-foreground font-normal mx-1">{">"}</span> {homeLoad.destination}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-foreground font-bold tabular-nums">{homeLoad.miles} mi</span>
              <span className="text-sm text-success font-bold tabular-nums">${(homeLoad.rateCents / 100).toLocaleString()}</span>
              <span className="text-sm text-foreground font-bold tabular-nums">${(homeLoad.rateCents / 100 / homeLoad.miles).toFixed(2)}/mi</span>
              <span className="text-xs text-muted-foreground ml-auto">{homeLoad.pickupTime}</span>
            </div>
          </div>
        </button>
      </div>

      {/* AI reasoning - below the cards, plain conversational language */}
      <div className="rounded-2xl bg-card border border-border p-5">
        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Why STAY?</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          That St. Louis load is paying <span className="text-foreground font-bold">$3.50/mi</span> which is way above
          the average $2.10 for this corridor. It picks up in 2 hours so timing works with your
          {" "}<span className="text-foreground font-bold">{driver.hosRemainingHours}h</span> remaining.
          The homebound option through Omaha only pays $3.00/mi and you{"'"}d still be 405 mi from Denver after.
          Better to grab the money now and catch a westbound load tomorrow morning when rates are fresh.
        </p>
      </div>

      {/* Confirmation after tap */}
      {choice && (
        <div className="rounded-2xl bg-success/10 border-2 border-success/30 p-5">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 className="h-6 w-6 text-success" />
            <p className="text-base font-bold text-foreground">
              {choice === "HOME"
                ? `Heading home via ${homeLoad.destination}`
                : `Staying on - ${stayLoad.origin} to ${stayLoad.destination}`}
            </p>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {choice === "HOME"
              ? `Pickup at ${homeLoad.pickupTime}. ${homeLoad.miles} mi, $${(homeLoad.rateCents / 100).toLocaleString()}.`
              : `Pickup at ${stayLoad.pickupTime}. ${stayLoad.miles} mi, $${(stayLoad.rateCents / 100).toLocaleString()}.`}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setChoice(null)}
              className="rounded-xl bg-secondary text-muted-foreground font-medium text-sm px-5 py-3 min-h-[44px] active:bg-border transition-colors"
            >
              Change Mind
            </button>
            <button className="flex-1 rounded-xl bg-success text-success-foreground font-bold text-sm px-5 py-3 min-h-[44px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
              <ArrowRight className="h-4 w-4" />
              Navigate to Pickup
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
