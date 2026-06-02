import type React from "react"
import { AdminNav } from "@/components/navigation/admin-nav"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-slate-900">Admin Portal</h1>
            <AdminNav />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">admin@yachtcrew.com</span>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
