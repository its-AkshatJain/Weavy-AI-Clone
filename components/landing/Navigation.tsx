'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface NavigationProps {
  scrollY: number
}

export default function Navigation({ scrollY }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { label: 'COLLECTIVE', href: '#' },
    { label: 'ENTERPRISE', href: '#' },
    { label: 'PRICING', href: '#' },
    { label: 'REQUEST A DEMO', href: '#' },
    { label: 'SIGN IN', href: '#' },
  ]

  // Close mobile menu when clicking outside or on a link
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isMobileMenuOpen && !target.closest('nav')) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      <nav
        className={`fixed left-0 right-0 z-50 transition-all duration-500 overflow-hidden ${
          scrollY > 50
            ? 'top-0 bg-[#0a0a0a]/98 backdrop-blur-xl'
            : 'top-0 bg-transparent'
        }`}
      >
        <div className="max-w-[1920px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between min-w-0">
          {/* Logo Section */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-sm flex items-center justify-center flex-shrink-0">
              <span className="text-black text-xs font-bold">W</span>
            </div>
            <span className="text-sm sm:text-base md:text-lg font-semibold tracking-tight text-black font-display whitespace-nowrap">
              WEAVY
            </span>
            <div className="hidden md:block w-px h-4 bg-black/20 flex-shrink-0" />
            <span className="hidden md:inline text-xs text-black tracking-wider whitespace-nowrap">
              ARTISTIC INTELLIGENCE
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="relative px-3 py-2 text-xs font-medium text-black/70 hover:text-white transition-all duration-300 tracking-wider group whitespace-nowrap"
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute inset-0 bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            ))}
            <Link
              href="/workflow"
              className={`px-4 py-2 bg-[#FFD700] hover:bg-[#FFE44D] text-black font-semibold rounded transition-all duration-500 tracking-wider whitespace-nowrap ${
                scrollY > 50
                  ? 'text-xs'
                  : 'text-base px-6 py-3'
              }`}
            >
              START NOW
            </Link>
          </div>

          {/* Mobile: START NOW button and Hamburger - Hidden on small screens (mobile) */}
          <div className="hidden md:flex lg:hidden items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <Link
              href="/workflow"
              className="px-2 py-1.5 sm:px-3 sm:py-2 bg-[#FFD700] hover:bg-[#FFE44D] text-black font-semibold rounded transition-all duration-300 tracking-wider text-[10px] sm:text-xs whitespace-nowrap"
            >
              START NOW
            </Link>
            <button
              onClick={toggleMobileMenu}
              className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-black focus:outline-none focus:ring-2 focus:ring-black/20 rounded flex-shrink-0"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open menu</span>
              <div className="w-5 h-4 sm:w-6 sm:h-5 flex flex-col justify-between">
                <span
                  className={`block h-0.5 w-full bg-black transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 w-full bg-black transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 w-full bg-black transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Hidden on small screens (mobile) */}
      <div
        className={`fixed inset-0 z-40 hidden md:block lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        style={{ marginTop: '60px' }}
      >
        <div
          className={`absolute top-0 left-0 right-0 bg-[#0a0a0a]/98 backdrop-blur-xl border-t border-black/20 transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="max-w-[1920px] mx-auto px-4 py-6 space-y-1 max-h-[calc(100vh-60px)] overflow-y-auto">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-white/70 hover:text-white hover:bg-black/20 rounded transition-all duration-200 tracking-wider"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

