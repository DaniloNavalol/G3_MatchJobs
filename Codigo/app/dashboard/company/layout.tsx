import type React from "react"
import CompanySidebar from "@/components/company-sidebar"
import CompanyHeader from "@/components/company-header"

export default function CompanyDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <CompanySidebar />
      <div className="flex-1 flex flex-col">
        <CompanyHeader />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
