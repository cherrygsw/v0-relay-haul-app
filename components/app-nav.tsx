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
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
        <Link href="/" className="mr-10 flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground transition-transform group-hover:scale-105">
            <Truck className="h-3.5 w-3.5 text-background" />
          </div>
          <span className="font-serif text-lg font-semibold tracking-tight text-foreground">
            FreightBite
          </span>
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
                  "relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5">
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
            <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-foreground border border-border">
              MT
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
