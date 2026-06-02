"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Anchor, Menu } from "lucide-react"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Anchor className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">CrewMatch</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/find-crew"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/find-crew" ? "text-foreground" : "text-muted-foreground",
              )}
            >
              Find Crew
            </Link>
            <Link
              href="/find-jobs"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/find-jobs" ? "text-foreground" : "text-muted-foreground",
              )}
            >
              Find Jobs
            </Link>
            <Link
              href="/pricing"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/pricing" ? "text-foreground" : "text-muted-foreground",
              )}
            >
              Pricing
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild className="hidden md:inline-flex">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up">Get Started</Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
