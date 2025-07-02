"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header>
      <div className="header-area header-transparent">
        <div className="border-b border-gray-200 bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              <div className="flex-shrink-0">
                <Link href="/">
                  <Image
                    src="/assets/img/logo/matchjoblogo.png"
                    alt="MatchJobs"
                    width={240}
                    height={60}
                    className="h-auto"
                  />
                </Link>
              </div>

              <div className="hidden lg:flex items-center space-x-8">
                <nav className="flex space-x-8">
                  <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                    Início
                  </Link>
                  <Link href="/jobs" className="text-gray-700 hover:text-blue-600 font-medium">
                    Buscar Vagas
                  </Link>
                </nav>

                <div className="flex space-x-4">
                  <Link href="/auth/register" className="head-btn1">
                    Cadastrar
                  </Link>
                  <Link href="/auth/login" className="head-btn2">
                    Entrar
                  </Link>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="lg:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-blue-600">
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
              <div className="lg:hidden py-4 border-t border-gray-200">
                <nav className="flex flex-col space-y-4">
                  <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                    Início
                  </Link>
                  <Link href="/jobs" className="text-gray-700 hover:text-blue-600 font-medium">
                    Buscar Vagas
                  </Link>
                  <div className="flex flex-col space-y-2 pt-4">
                    <Link href="/auth/register" className="head-btn1 text-center">
                      Cadastrar
                    </Link>
                    <Link href="/auth/login" className="head-btn2 text-center">
                      Entrar
                    </Link>
                  </div>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
