'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    // Auto-redirect to home after 2 seconds
    const timer = setTimeout(() => {
      router.push('/')
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-black mb-4 font-display">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-black mb-4 font-display">
          Page Not Found
        </h2>
        <p className="text-lg text-black/70 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist. Redirecting to home...
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[#FFD700] hover:bg-[#FFE44D] text-black font-semibold rounded-lg transition-all duration-300 hover:scale-105"
        >
          Go to Home
        </Link>
      </div>
    </div>
  )
}

