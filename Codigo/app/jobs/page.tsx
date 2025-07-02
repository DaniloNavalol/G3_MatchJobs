import Header from "@/components/header"
import Footer from "@/components/footer"
import Preloader from "@/components/preloader"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Clock, Filter } from "lucide-react"

const jobs = [
  {
    id: 1,
    title: "Analista de Marketing Digital",
    company: "Agência Criativa XYZ",
    location: "São Luís, MA",
    salary: "R$ 4.500,00",
    type: "Tempo Integral",
    postedAt: "7 horas atrás",
    logo: "/assets/img/icon/job-list1.png",
  },
  {
    id: 2,
    title: "Desenvolvedor Frontend React",
    company: "Tech Solutions",
    location: "São Paulo, SP",
    salary: "R$ 6.000,00",
    type: "Remoto",
    postedAt: "1 dia atrás",
    logo: "/assets/img/icon/job-list2.png",
  },
  {
    id: 3,
    title: "Designer UX/UI",
    company: "Design Studio",
    location: "Rio de Janeiro, RJ",
    salary: "R$ 5.200,00",
    type: "Híbrido",
    postedAt: "2 dias atrás",
    logo: "/assets/img/icon/job-list3.png",
  },
  {
    id: 4,
    title: "Analista de Dados",
    company: "Data Corp",
    location: "Belo Horizonte, MG",
    salary: "R$ 5.800,00",
    type: "Tempo Integral",
    postedAt: "3 dias atrás",
    logo: "/assets/img/icon/job-list4.png",
  },
]

export default function JobsPage() {
  return (
    <>
      <Preloader />
      <Header />

      <main>
        {/* Search Bar */}
        <div className="bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <form className="flex gap-4">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Buscar vagas por título, empresa ou palavra-chave"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors"
                >
                  Buscar
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-6">
                    <Filter className="w-5 h-5 text-green-500 mr-2" />
                    <h4 className="text-lg font-semibold">Filtrar Vagas</h4>
                  </div>

                  {/* Area Filter */}
                  <div className="mb-6">
                    <h5 className="font-medium mb-3">Área Profissional</h5>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Todas as Áreas</option>
                      <option value="">Design</option>
                      <option value="">Programação</option>
                      <option value="">Administração</option>
                      <option value="">Marketing</option>
                    </select>
                  </div>

                  {/* Job Type Filter */}
                  <div className="mb-6">
                    <h5 className="font-medium mb-3">Tipo de Trabalho</h5>
                    <div className="space-y-2">
                      {["Tempo Integral", "Meio Período", "Remoto", "Freelancer"].map((type) => (
                        <label key={type} className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div className="mb-6">
                    <h5 className="font-medium mb-3">Localização</h5>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Qualquer Local</option>
                      <option value="">Maranhão</option>
                      <option value="">Piauí</option>
                      <option value="">Bahia</option>
                      <option value="">Pernambuco</option>
                    </select>
                  </div>

                  {/* Date Filter */}
                  <div>
                    <h5 className="font-medium mb-3">Publicadas há</h5>
                    <div className="space-y-2">
                      {[
                        "Qualquer período",
                        "Hoje",
                        "Últimos 2 dias",
                        "Últimos 5 dias",
                        "Últimos 7 dias",
                        "Últimos 14 dias",
                      ].map((period) => (
                        <label key={period} className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm">{period}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Job List */}
              <div className="lg:col-span-3">
                <div className="mb-6 flex justify-between items-center">
                  <span className="text-gray-600">39,782 vagas encontradas</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Ordenar por</span>
                    <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                      <option value="">Mais recentes</option>
                      <option value="">Mais antigas</option>
                      <option value="">Salário</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="single-job-items bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Image
                              src={job.logo || "/placeholder.svg"}
                              alt={job.company}
                              width={40}
                              height={40}
                              className="h-auto"
                            />
                          </div>
                          <div>
                            <Link href={`/jobs/${job.id}`}>
                              <h4 className="text-lg font-semibold text-gray-800 hover:text-blue-600 mb-2">
                                {job.title}
                              </h4>
                            </Link>
                            <ul className="space-y-1 text-sm text-gray-600">
                              <li className="font-medium">{job.company}</li>
                              <li className="flex items-center">
                                <MapPin size={14} className="mr-1" />
                                {job.location}
                              </li>
                              <li className="text-green-600 font-medium">{job.salary}</li>
                            </ul>
                          </div>
                        </div>

                        <div className="text-right">
                          <Link
                            href={`/jobs/${job.id}`}
                            className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-2"
                          >
                            {job.type}
                          </Link>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock size={14} className="mr-1" />
                            {job.postedAt}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button className="px-3 py-2 bg-blue-600 text-white rounded-md">01</button>
                    <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">02</button>
                    <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">03</button>
                    <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">→</button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
