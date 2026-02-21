import { AppNav } from "@/components/app-nav"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <AppNav />
      <main className="mx-auto max-w-7xl px-6 py-8 lg:py-10">
        {children}
      </main>
    </div>
  )
}
