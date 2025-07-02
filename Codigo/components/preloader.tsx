"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <div className="preloader fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="preloader-circle mx-auto mb-4"></div>
        <Image src="/assets/img/logo/Matchjobslogo.png" alt="MatchJobs" width={80} height={80} className="h-auto" />
      </div>
    </div>
  )
}
