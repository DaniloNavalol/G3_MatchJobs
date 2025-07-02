import Header from "@/components/header"
import Footer from "@/components/footer"
import Preloader from "@/components/preloader"
import Image from "next/image"
import { MapPin } from "lucide-react"

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch job data based on params.id
  const job = {
    id: params.id,
    title: "Analista de Marketing Digital",
    company: "Agência Criativa XYZ",
    location: "São Luís, MA",
    salary: "R$ 4.500,00",
    type: "CLT - Presencial",
    postedAt: "24 jun 2025",
    deadline: "24 jul 2025",
    vacancies: 1,
    logo: "/assets/img/icon/job-list1.png",
    description:
      "Estamos em busca de um(a) Analista de Marketing Digital para atuar na criação e execução de estratégias digitais com foco em geração de leads e aumento de visibilidade online. O profissional será responsável por campanhas de mídia paga, SEO, e-mail marketing, automação e análise de resultados através de métricas e KPIs.",
    skills: [
      "Google Ads, Facebook Ads e LinkedIn Ads",
      "SEO On-page e Off-page",
      "Ferramentas de automação (RD Station, HubSpot, etc.)",
      "Google Analytics e interpretação de métricas",
      "Copywriting e produção de conteúdo",
    ],
    requirements: [
      "Graduação em Marketing, Comunicação, Publicidade ou áreas correlatas",
      "2 anos de experiência comprovada na área",
      "Certificações em Google Ads ou Meta Ads são diferenciais",
      "Experiência com plataformas de CRM e automação",
    ],
    companyInfo: {
      name: "Agência Criativa XYZ",
      description:
        "Somos uma agência especializada em estratégias digitais inovadoras, com foco em resultados e crescimento sustentável para nossos clientes.",
      website: "www.agenciacriativaxyz.com.br",
      email: "rh@agenciacriativaxyz.com.br",
    },
  }

  return (
    <>
      <Preloader />
      <Header />

      <main>
        <div className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Job Header */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
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
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold text-gray-800 mb-2">{job.title}</h1>
                      <ul className="space-y-1 text-gray-600">
                        <li className="font-semibold text-lg">{job.company}</li>
                        <li className="flex items-center">
                          <MapPin size={16} className="mr-2" />
                          {job.location}
                        </li>
                        <li className="text-green-600 font-semibold text-lg">{job.salary}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Job Details */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="mb-8">
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">Descrição da Vaga</h4>
                    <p className="text-gray-600 leading-relaxed">{job.description}</p>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">Conhecimentos e Habilidades</h4>
                    <ul className="space-y-2">
                      {job.skills.map((skill, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-gray-600">{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">Formação e Experiência</h4>
                    <ul className="space-y-2">
                      {job.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-gray-600">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Job Info */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">Informações da Vaga</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Publicado em:</span>
                      <span className="text-gray-600">{job.postedAt}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Local:</span>
                      <span className="text-gray-600">{job.location}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Vagas:</span>
                      <span className="text-gray-600">{job.vacancies}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Tipo:</span>
                      <span className="text-gray-600">{job.type}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Salário:</span>
                      <span className="text-green-600 font-semibold">{job.salary}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Encerramento:</span>
                      <span className="text-gray-600">{job.deadline}</span>
                    </li>
                  </ul>

                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors mt-6">
                    Candidatar-se
                  </button>
                </div>

                {/* Company Info */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">Sobre a Empresa</h4>
                  <h6 className="font-semibold text-gray-800 mb-2">{job.companyInfo.name}</h6>
                  <p className="text-gray-600 mb-4">{job.companyInfo.description}</p>
                  <ul className="space-y-2">
                    <li>
                      <span className="font-medium text-gray-700">Site:</span>
                      <span className="text-blue-600 ml-2">{job.companyInfo.website}</span>
                    </li>
                    <li>
                      <span className="font-medium text-gray-700">Email:</span>
                      <span className="text-blue-600 ml-2">{job.companyInfo.email}</span>
                    </li>
                  </ul>
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
