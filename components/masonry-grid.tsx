import { cn } from "@/lib/utils"

interface MasonryGridProps {
  children: React.ReactNode
  /** Number of columns at each breakpoint */
  columns?: {
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  /** Gap between items in Tailwind spacing units */
  gap?: string
  className?: string
}

/**
 * Pinterest-style masonry/waterfall grid using CSS columns.
 * Children flow top-to-bottom then left-to-right, creating
 * the staggered height effect.
 */
export function MasonryGrid({
  children,
  columns = { sm: 1, md: 2, lg: 3 },
  gap = "1rem",
  className,
}: MasonryGridProps) {
  return (
    <div
      className={cn("masonry-grid", className)}
      style={
        {
          "--masonry-gap": gap,
          "--masonry-cols-sm": columns.sm ?? 1,
          "--masonry-cols-md": columns.md ?? 2,
          "--masonry-cols-lg": columns.lg ?? 3,
          "--masonry-cols-xl": columns.xl ?? columns.lg ?? 3,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}

/**
 * Wraps each child in the masonry grid to prevent
 * column breaks from splitting cards.
 */
export function MasonryItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("masonry-item", className)}>
      {children}
    </div>
  )
}
