import Header from "@/components/header"
import Footer from "@/components/footer"
import Preloader from "@/components/preloader"
import Image from "next/image"
import Link from "next/link"
import { Search, FileText, Trophy } from "lucide-react"

export default function HomePage() {
  return (
    <>
      <Preloader />
      <Header />

      <main>
        {/* Hero Section */}
        <div className="relative min-h-screen flex items-center">
          <div className="absolute inset-0 z-0">
            <Image src="/assets/img/hero/h1_hero.jpg" alt="Hero Background" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>

          <div className="relative z-10 container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">
                Encontre o <span className="text-orange-400">emprego</span> dos seus sonhos
              </h1>
            </div>

            {/* Search Box */}
            <div className="max-w-4xl mt-12">
              <form className="bg-white rounded-lg p-6 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Cargo ou palavra-chave"
                    />
                  </div>
                  <div>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">São Luís - MA</option>
                      <option value="">São José de Ribamar - MA</option>
                      <option value="">Paço do Lumiar - MA</option>
                      <option value="">Raposa - MA</option>
                    </select>
                  </div>
                  <div>
                    <Link
                      href="/jobs"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors flex items-center justify-center"
                    >
                      Buscar
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="text-orange-400 font-medium text-lg">Processo de Inscrição</span>
              <h2 className="text-4xl font-bold text-white mt-2">Como Funciona</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center text-white">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-white" />
                </div>
                <h5 className="text-xl font-semibold mb-4">1. Encontre uma vaga</h5>
                <p className="text-gray-200">
                  Encontre oportunidades que combinam com suas habilidades e interesses. Filtre por área, localização ou
                  tipo de contrato.
                </p>
              </div>

              <div className="text-center text-white">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText size={32} className="text-white" />
                </div>
                <h5 className="text-xl font-semibold mb-4">2. Candidate-se</h5>
                <p className="text-gray-200">
                  Envie seu currículo de forma rápida e fácil. Aproveite nossas ferramentas de Análise Comportamental
                  para se destacar entre os candidatos.
                </p>
              </div>

              <div className="text-center text-white">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy size={32} className="text-white" />
                </div>
                <h5 className="text-xl font-semibold mb-4">3. Conquiste seu emprego</h5>
                <p className="text-gray-200">
                  Agora é só aguardar o retorno das empresas. Aqui, você está mais perto de trabalhar no emprego dos
                  seus sonhos!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
