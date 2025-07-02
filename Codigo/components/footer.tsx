import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Globe, DribbbleIcon as Behance } from "lucide-react"

export default function Footer() {
  return (
    <footer>
      <div className="footer-bg footer-padding">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Quem Somos</h4>
                <p className="text-gray-600">
                  Uma plataforma dedicada a unir profissionais talentosos às melhores empresas do mercado.
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Contato</h4>
              <ul className="space-y-2">
                <li>
                  <a href="tel:+5598400289222" className="text-gray-600 hover:text-blue-600">
                    Telefone: (98) 4002-8922
                  </a>
                </li>
                <li>
                  <a href="mailto:contato@matchjobs.com" className="text-gray-600 hover:text-blue-600">
                    Email: contato@matchjobs.com
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Links Úteis</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/help" className="text-gray-600 hover:text-blue-600">
                    Ajuda
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 hover:text-blue-600">
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-600 hover:text-blue-600">
                    Política de Privacidade
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Newsletter</h4>
              <p className="text-gray-600 mb-4">
                Cadastre seu e-mail e receba dicas de carreira e novidades do mercado na sua caixa de entrada.
              </p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
                >
                  <Image src="/assets/img/icon/form.png" alt="Enviar" width={20} height={20} />
                </button>
              </form>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-8 border-t border-gray-200">
            <div>
              <Link href="/">
                <Image
                  src="/assets/img/logo/Matchjobslogo.png"
                  alt="MatchJobs"
                  width={100}
                  height={100}
                  className="h-auto"
                />
              </Link>
            </div>

            <div className="text-center">
              <span className="text-3xl font-bold text-blue-600">5000+</span>
              <p className="text-gray-600">Profissionais</p>
            </div>

            <div className="text-center">
              <span className="text-3xl font-bold text-blue-600">451</span>
              <p className="text-gray-600">Empresas Contratando</p>
            </div>

            <div className="text-center">
              <span className="text-3xl font-bold text-blue-600">568</span>
              <p className="text-gray-600">Oportunidades Disponíveis</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div></div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <Globe size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <Behance size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
