import type React from "react"
import CandidateSidebar from "@/components/candidate-sidebar"
import CandidateHeader from "@/components/candidate-header"

export default function CandidateDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <CandidateSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <CandidateHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
        <footer className="bg-gray-50 border-t border-gray-200 py-4 px-6">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>© 2025 MatchJobs. Todos os direitos reservados.</span>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-900">
                Ajuda
              </a>
              <a href="#" className="hover:text-gray-900">
                Licenças
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
