import Link from "next/link"
import {
  Truck,
  ArrowRight,
  Zap,
  Route,
  Mail,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--primary)_0%,transparent_50%)] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 lg:px-6 lg:py-36">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground">
              <Zap className="h-3.5 w-3.5 text-primary" />
              AI-Powered Freight Relay
            </div>
            <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
              Every load delivered.
              <span className="block text-primary">No driver drives alone.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground lg:text-xl">
              AI dispatcher breaks long-haul loads into HOS-legal relay legs, matches nearby drivers, and emails your network to fill gaps. Think DoorDash for solo truck drivers.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="gap-2 text-base">
                <Link href="/shipper">
                  Submit a Load
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 text-base">
                <Link href="/driver">
                  Driver Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Route,
                title: "Smart Segmentation",
                description:
                  "AI splits any route into HOS-legal relay legs, snapping handoffs to real truck stops.",
              },
              {
                icon: Truck,
                title: "Driver Matching",
                description:
                  "Matches the nearest available driver by HOS, proximity, and corridor experience.",
              },
              {
                icon: Mail,
                title: "Network Outreach",
                description:
                  "AI drafts personalized emails to your broker contacts when relay gaps need filling.",
              },
              {
                icon: Clock,
                title: "What's Next Engine",
                description:
                  "After each leg, AI recommends: drive home or stay on the road for the next high-pay load.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center lg:px-6">
          <h2 className="text-balance text-3xl font-bold text-foreground lg:text-4xl">
            Ready to relay?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Start dispatching loads in under 30 seconds.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/shipper">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
