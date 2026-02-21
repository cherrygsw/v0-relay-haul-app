import Link from "next/link"
import {
  Truck,
  ArrowRight,
  Zap,
  Route,
  Mail,
  Clock,
  ChevronRight,
  Shield,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroRouteAnimation } from "@/components/hero-route-animation"

const STATS = [
  { value: "2,015", unit: "mi", label: "Chicago to LA" },
  { value: "4", unit: "legs", label: "Relay Segments" },
  { value: "< 30", unit: "sec", label: "AI Dispatch Time" },
  { value: "100", unit: "%", label: "HOS Compliant" },
]

const FEATURES = [
  {
    icon: Route,
    title: "Smart Segmentation",
    description: "AI splits any route into HOS-legal relay legs, snapping handoffs to real truck stops along the corridor.",
    tag: "AI Engine",
  },
  {
    icon: Truck,
    title: "Driver Matching",
    description: "Matches the nearest available driver by HOS hours, proximity, trailer type, and corridor experience.",
    tag: "Matching",
  },
  {
    icon: Mail,
    title: "Network Outreach",
    description: "AI drafts personalized broker emails when relay gaps need filling, leveraging your existing contacts.",
    tag: "Outreach",
  },
  {
    icon: Clock,
    title: "What's Next Engine",
    description: "After each delivery leg, AI recommends the optimal next move: drive home or catch a high-pay load.",
    tag: "Decision AI",
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <nav className="relative z-20 mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary glow-sm-primary">
            <Truck className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Relay Haul
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
            <Link href="/shipper">Shippers</Link>
          </Button>
          <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
            <Link href="/driver">Drivers</Link>
          </Button>
          <Button asChild size="sm" className="gap-1.5 rounded-xl">
            <Link href="/shipper">
              Get Started
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative">
        {/* Background Effects */}
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-success/3 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div className="flex flex-col">
              <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full bg-primary/8 px-4 py-2 ring-1 ring-primary/20">
                <Zap className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary tracking-wide">
                  AI-Powered Freight Relay
                </span>
              </div>

              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
                Every load delivered.{" "}
                <span className="text-gradient">No driver drives alone.</span>
              </h1>

              <p className="mt-6 max-w-lg text-pretty text-base text-muted-foreground leading-relaxed lg:text-lg">
                AI dispatcher breaks long-haul loads into HOS-legal relay legs, matches nearby drivers, and emails your broker network to fill gaps. Think DoorDash for solo truckers.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="gap-2 rounded-xl h-12 px-6 text-sm font-semibold glow-primary">
                  <Link href="/shipper">
                    Submit a Load
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2 rounded-xl h-12 px-6 text-sm font-semibold border-border/60 hover:border-primary/30 hover:bg-primary/5">
                  <Link href="/driver">
                    Driver Dashboard
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex items-center gap-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3.5 w-3.5 text-success" />
                  <span>HOS Compliant</span>
                </div>
                <div className="h-3 w-px bg-border" />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <BarChart3 className="h-3.5 w-3.5 text-primary" />
                  <span>Real-time Tracking</span>
                </div>
                <div className="h-3 w-px bg-border" />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Zap className="h-3.5 w-3.5 text-warning" />
                  <span>AI Dispatching</span>
                </div>
              </div>
            </div>

            {/* Right: Animated Route Visualization */}
            <div className="relative hidden lg:block">
              <div className="relative h-[420px] w-full rounded-2xl overflow-hidden border border-border/40 bg-card/30">
                <HeroRouteAnimation />
                {/* Overlay info cards */}
                <div className="absolute top-4 right-4 glass glass-border rounded-xl px-4 py-3 z-10">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Live Relay</p>
                  <p className="text-sm font-bold text-foreground mt-0.5">Chicago → LA</p>
                  <p className="text-xs text-success font-medium mt-0.5">2 of 4 legs active</p>
                </div>
                <div className="absolute bottom-4 left-4 glass glass-border rounded-xl px-4 py-3 z-10">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">AI Status</p>
                  <p className="text-xs text-primary font-semibold mt-0.5">Searching Leg 3 driver...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative border-y border-border/40">
        <div className="absolute inset-0 bg-card/40" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border/40">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center py-8 gap-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                    {stat.value}
                  </span>
                  <span className="text-sm font-medium text-primary">{stat.unit}</span>
                </div>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-primary uppercase tracking-[0.2em]">How it Works</span>
            <h2 className="mt-4 text-balance text-3xl font-bold text-foreground lg:text-4xl">
              Four systems. One relay chain.
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              From load submission to final delivery, every step is AI-optimized and HOS-compliant.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/60 p-6 transition-all duration-300 hover:border-primary/30 hover:glow-sm-primary"
              >
                {/* Number */}
                <span className="absolute top-4 right-4 text-6xl font-bold text-border/30 leading-none select-none">
                  {i + 1}
                </span>

                <div className="relative">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-[0.15em] mb-4">
                    {feature.tag}
                  </span>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 transition-all group-hover:glow-sm-primary">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-border/40">
        <div className="absolute inset-0 bg-card/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground lg:text-5xl">
            Ready to <span className="text-gradient">relay</span>?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-md mx-auto">
            Start dispatching loads in under 30 seconds. No contracts, no fleet required.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button asChild size="lg" className="gap-2 rounded-xl h-12 px-8 text-sm font-semibold glow-primary">
              <Link href="/shipper">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40">
        <div className="mx-auto max-w-7xl px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <Truck className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="text-sm font-bold text-foreground">Relay Haul</span>
          </div>
          <p className="text-xs text-muted-foreground">AI-powered freight relay platform</p>
        </div>
      </footer>
    </main>
  )
}
