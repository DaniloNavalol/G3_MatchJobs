import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MatchJobs - Encontre o emprego dos seus sonhos",
  description: "Uma plataforma dedicada a unir profissionais talentosos às melhores empresas do mercado.",
  icons: {
    icon: "/assets/img/logo/Matchjobslogo.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
