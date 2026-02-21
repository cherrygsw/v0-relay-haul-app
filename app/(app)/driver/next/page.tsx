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
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DEMO_DRIVERS, NEARBY_LOADS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const driver = DEMO_DRIVERS[0] // Marcus — just finished a leg, now in Iowa City
const currentLocation = "Iowa City, IA"
const homeMiles = 670

const homeLoad = NEARBY_LOADS[0] // Toward Denver
const stayLoad = NEARBY_LOADS[2] // St. Louis high-pay

export default function WhatsNextPage() {
  const [choice, setChoice] = useState<"HOME" | "STAY" | null>(null)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
          {"What's Next?"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          You just completed Leg 1 — AI has your next move ready
        </p>
      </div>

      {/* Current Status */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
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
          <Badge variant="secondary" className="w-fit">
            Leg 1 Complete
          </Badge>
        </CardContent>
      </Card>

      {/* AI Recommendation */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">
              AI Recommendation: Stay on the Road
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              There{"'"}s a $945 load to St. Louis picking up in 2 hours — that{"'"}s
              $3.50/mi, well above market rate. Your home in Denver is 670 miles
              west, and the only homebound load pays $795 for 265 miles through
              Omaha. I{"'"}d grab the St. Louis run, then catch a westbound load
              tomorrow morning from there.
            </p>
          </div>
        </div>
      </div>

      {/* Two Options */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Drive Home Option */}
        <Card
          className={cn(
            "cursor-pointer transition-all hover:border-primary/20",
            choice === "HOME" && "border-primary ring-2 ring-primary/20"
          )}
          onClick={() => setChoice("HOME")}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Home className="h-5 w-5 text-muted-foreground" />
              </div>
              {choice === "HOME" && (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              )}
            </div>
            <CardTitle className="mt-2">Drive Home</CardTitle>
            <CardDescription>
              Pick up a load heading toward {driver.homeCity}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {/* Load Details */}
            <div className="rounded-lg bg-secondary/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {homeLoad.origin} → {homeLoad.destination}
                  </span>
                </div>
                <span className="text-sm font-bold text-foreground">
                  ${(homeLoad.rateCents / 100).toLocaleString()}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center gap-0.5">
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-semibold text-foreground">
                    {homeLoad.miles} mi
                  </span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <DollarSign className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-semibold text-foreground">
                    ${(homeLoad.rateCents / 100 / homeLoad.miles).toFixed(2)}/mi
                  </span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-semibold text-foreground">
                    {homeLoad.pickupTime}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              Direction: {homeLoad.direction}
            </div>
            <p className="text-xs text-muted-foreground">
              ETA home after this load: ~11 PM tomorrow
            </p>
          </CardContent>
        </Card>

        {/* Stay on Road Option */}
        <Card
          className={cn(
            "cursor-pointer transition-all hover:border-primary/20",
            choice === "STAY" && "border-primary ring-2 ring-primary/20",
            !choice && "border-primary/30"
          )}
          onClick={() => setChoice("STAY")}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div className="flex items-center gap-2">
                {!choice && (
                  <Badge className="bg-primary/10 text-primary border-0 text-[10px]">
                    Recommended
                  </Badge>
                )}
                {choice === "STAY" && (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                )}
              </div>
            </div>
            <CardTitle className="mt-2">Stay on the Road</CardTitle>
            <CardDescription>
              High-pay load available nearby
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {/* Load Details */}
            <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="h-3.5 w-3.5 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {stayLoad.origin} → {stayLoad.destination}
                  </span>
                </div>
                <span className="text-sm font-bold text-primary">
                  ${(stayLoad.rateCents / 100).toLocaleString()}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center gap-0.5">
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-semibold text-foreground">
                    {stayLoad.miles} mi
                  </span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <DollarSign className="h-3 w-3 text-primary" />
                  <span className="text-xs font-semibold text-primary">
                    ${(stayLoad.rateCents / 100 / stayLoad.miles).toFixed(2)}/mi
                  </span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-semibold text-foreground">
                    {stayLoad.pickupTime}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              Direction: {stayLoad.direction}
            </div>
            <p className="text-xs text-muted-foreground">
              $3.50/mi — 40% above average corridor rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action */}
      {choice && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-success/20 bg-success/5 p-6">
          <CheckCircle2 className="h-8 w-8 text-success" />
          <p className="text-center text-sm font-medium text-foreground">
            {choice === "HOME"
              ? `Accepted the ${homeLoad.origin} → ${homeLoad.destination} load. Head to pickup.`
              : `Accepted the ${stayLoad.origin} → ${stayLoad.destination} load. Pickup at 3:00 PM today.`}
          </p>
          <Button variant="outline" size="sm" onClick={() => setChoice(null)}>
            Change Decision
          </Button>
        </div>
      )}

      {/* All Nearby Loads */}
      <Card>
        <CardHeader>
          <CardTitle>All Nearby Loads</CardTitle>
          <CardDescription>
            {NEARBY_LOADS.length} loads within range of {currentLocation}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {NEARBY_LOADS.map((load) => (
              <div
                key={load.id}
                className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">
                    {load.origin} → {load.destination}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {load.miles} mi &middot; {load.direction} &middot;{" "}
                    {load.pickupTime}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">
                    ${(load.rateCents / 100).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    ${(load.rateCents / 100 / load.miles).toFixed(2)}/mi
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
