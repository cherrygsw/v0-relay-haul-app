import { cn } from "@/lib/utils"
import type { LegStatus } from "@/lib/mock-data"

const STATUS_CONFIG: Record<
  LegStatus,
  { label: string; className: string; dotClassName: string }
> = {
  OPEN: {
    label: "Open",
    className: "bg-muted-foreground/8 text-muted-foreground ring-1 ring-muted-foreground/15",
    dotClassName: "bg-muted-foreground",
  },
  ASSIGNED: {
    label: "Assigned",
    className: "bg-primary/8 text-primary ring-1 ring-primary/20",
    dotClassName: "bg-primary",
  },
  IN_TRANSIT: {
    label: "In Transit",
    className: "bg-success/8 text-success ring-1 ring-success/20",
    dotClassName: "bg-success",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-success/8 text-success ring-1 ring-success/20",
    dotClassName: "bg-success",
  },
  SEARCHING: {
    label: "Searching",
    className: "bg-warning/8 text-warning ring-1 ring-warning/20",
    dotClassName: "bg-warning",
  },
}

export function StatusBadge({ status }: { status: LegStatus }) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase",
        config.className
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        {(status === "IN_TRANSIT" || status === "SEARCHING") && (
          <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", config.dotClassName)} />
        )}
        <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", config.dotClassName)} />
      </span>
      {config.label}
    </span>
  )
}
