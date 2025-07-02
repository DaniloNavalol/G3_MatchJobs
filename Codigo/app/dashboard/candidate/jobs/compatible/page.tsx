import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CompatibleJobs() {
  const jobs = [
    {
      id: 1,
      title: "Analista de Dados",
      company: "DataCorp",
      location: "São Paulo - SP",
      type: "CLT",
      compatibility: "Alta",
      compatibilityColor: "bg-green-100 text-green-800",
    },
    {
      id: 2,
      title: "Engenheiro de Software",
      company: "InovaTech",
      location: "Remoto",
      type: "PJ",
      compatibility: "Média",
      compatibilityColor: "bg-yellow-100 text-yellow-800",
    },
    {
      id: 3,
      title: "Product Manager",
      company: "StartHub",
      location: "Belo Horizonte - MG",
      type: "CLT",
      compatibility: "Baixa",
      compatibilityColor: "bg-red-100 text-red-800",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vagas Compatíveis</h1>
        <nav className="flex space-x-2 text-sm text-gray-600 mt-2">
          <span>Candidato</span>
          <span>›</span>
          <span>Vagas Compatíveis</span>
        </nav>
      </div>

      <Card>
        <CardHeader className="bg-green-700 text-white">
          <CardTitle>Lista de Vagas Compatíveis com seu Perfil</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4">#</th>
                  <th className="text-left py-3 px-4">Cargo</th>
                  <th className="text-left py-3 px-4">Empresa</th>
                  <th className="text-left py-3 px-4">Local</th>
                  <th className="text-left py-3 px-4">Tipo</th>
                  <th className="text-left py-3 px-4">Compatibilidade</th>
                  <th className="text-left py-3 px-4">Ação</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, index) => (
                  <tr key={job.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4 font-medium">{job.title}</td>
                    <td className="py-3 px-4">{job.company}</td>
                    <td className="py-3 px-4">{job.location}</td>
                    <td className="py-3 px-4">{job.type}</td>
                    <td className="py-3 px-4">
                      <Badge className={job.compatibilityColor}>{job.compatibility}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Link href={`/jobs/${job.id}`}>
                        <Button size="sm">Ver Detalhes</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
