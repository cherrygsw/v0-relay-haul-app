import { cn } from "@/lib/utils"
import type { LegStatus } from "@/lib/mock-data"

const STATUS_CONFIG: Record<
  LegStatus,
  { label: string; className: string; dotClassName: string }
> = {
  OPEN: {
    label: "Open",
    className: "bg-secondary text-muted-foreground",
    dotClassName: "bg-muted-foreground",
  },
  ASSIGNED: {
    label: "Assigned",
    className: "bg-primary/15 text-primary",
    dotClassName: "bg-primary",
  },
  IN_TRANSIT: {
    label: "In Transit",
    className: "bg-success/15 text-success",
    dotClassName: "bg-success animate-pulse",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-success/15 text-success",
    dotClassName: "bg-success",
  },
  SEARCHING: {
    label: "Searching",
    className: "bg-warning/15 text-warning",
    dotClassName: "bg-warning animate-pulse",
  },
}

export function StatusBadge({ status }: { status: LegStatus }) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dotClassName)} />
      {config.label}
    </span>
  )
}
