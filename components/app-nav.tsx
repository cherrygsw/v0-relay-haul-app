"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Truck,
  LayoutDashboard,
  Compass,
  Mail,
  Package,
} from "lucide-react"

const NAV_ITEMS = [
  { href: "/driver", label: "Dashboard", icon: LayoutDashboard },
  { href: "/driver/next", label: "What's Next?", icon: Compass },
  { href: "/driver/email", label: "Outreach", icon: Mail },
  { href: "/shipper", label: "Shipper", icon: Package },
]

export function AppNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 glass glass-border border-0 border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
        <Link href="/" className="mr-10 flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary glow-sm-primary transition-shadow group-hover:glow-primary">
            <Truck className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground leading-none">
              Relay Haul
            </span>
            <span className="text-[10px] text-muted-foreground tracking-widest uppercase leading-none mt-0.5">
              Freight Platform
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href + "/"))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-lg bg-primary/8 glow-sm-primary" />
                )}
                <item.icon className={cn("relative h-4 w-4", isActive && "text-primary")} />
                <span className="relative hidden sm:inline">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2.5 rounded-lg bg-success/8 px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="text-xs font-medium text-success">Online</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <p className="text-xs font-semibold text-foreground leading-none">Marcus T.</p>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Denver, CO</p>
            </div>
            <div className="h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center text-xs font-bold text-primary ring-1 ring-primary/20">
              MT
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
