import { AppNav } from "@/components/app-nav"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
        {children}
      </main>
    </>
  )
}
