'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CatchAll() {
  const router = useRouter()

  useEffect(() => {
    // Redirect any unknown route to home page
    // API routes are in app/api/ directory so they won't be caught by this
    router.replace('/')
  }, [router])

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-black/70">Redirecting...</p>
      </div>
    </div>
  )
}

