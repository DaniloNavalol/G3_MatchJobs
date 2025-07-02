"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Briefcase, ChevronDown } from "lucide-react"
import { useState } from "react"

export default function CompanySidebar() {
  const pathname = usePathname()
  const [isDashboardOpen, setIsDashboardOpen] = useState(true)
  const [isJobsOpen, setIsJobsOpen] = useState(true)

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen">
      {/* Logo */}
      <div className="p-4 border-b border-gray-700">
        <Link href="/" className="flex items-center">
          <img src="/assets/img/logo/matchjoblogowhite.png" alt="MatchJobs" className="h-8" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="mt-4">
        <ul className="space-y-2">
          {/* Dashboard */}
          <li>
            <button
              onClick={() => setIsDashboardOpen(!isDashboardOpen)}
              className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center">
                <Home className="w-5 h-5 mr-3" />
                <span>Dashboard</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDashboardOpen ? "rotate-180" : ""}`} />
            </button>
            {isDashboardOpen && (
              <ul className="ml-8 mt-2 space-y-1">
                <li>
                  <Link
                    href="/dashboard/company"
                    className={`block px-4 py-2 text-sm hover:bg-gray-800 transition-colors ${
                      pathname === "/dashboard/company" ? "bg-gray-800 text-blue-400" : ""
                    }`}
                  >
                    Perfil
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Jobs Management */}
          <li>
            <button
              onClick={() => setIsJobsOpen(!isJobsOpen)}
              className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center">
                <Briefcase className="w-5 h-5 mr-3" />
                <span>Gerenciar Vagas</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isJobsOpen ? "rotate-180" : ""}`} />
            </button>
            {isJobsOpen && (
              <ul className="ml-8 mt-2 space-y-1">
                <li>
                  <Link
                    href="/dashboard/company/jobs/open"
                    className={`block px-4 py-2 text-sm hover:bg-gray-800 transition-colors ${
                      pathname === "/dashboard/company/jobs/open" ? "bg-gray-800 text-blue-400" : ""
                    }`}
                  >
                    Vagas Abertas
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/company/jobs/closed"
                    className={`block px-4 py-2 text-sm hover:bg-gray-800 transition-colors ${
                      pathname === "/dashboard/company/jobs/closed" ? "bg-gray-800 text-blue-400" : ""
                    }`}
                  >
                    Vagas Encerradas
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </div>
  )
}
