'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface NavigationProps {
  scrollY: number
}

export default function Navigation({ scrollY }: NavigationProps) {
  const navItems = [
    { label: 'COLLECTIVE', href: '#' },
    { label: 'ENTERPRISE', href: '#' },
    { label: 'PRICING', href: '#' },
    { label: 'REQUEST A DEMO', href: '#' },
    { label: 'SIGN IN', href: '#' },
  ]

  return (
    <nav
      className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
        scrollY > 50
          ? 'top-0 bg-[#0a0a0a]/98 backdrop-blur-xl'
          : 'top-0 bg-transparent'
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
            <span className="text-black text-xs font-bold">W</span>
          </div>
          <span className="text-lg font-semibold tracking-tight text-black font-display">WEAVY</span>
          <div className="w-px h-4 bg-black/20" />
          <span className="text-xs text-black tracking-wider">ARTISTIC INTELLIGENCE</span>
        </div>
        <div className="flex items-center gap-2">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="relative px-3 py-2 text-xs font-medium text-black/70 hover:text-white transition-all duration-300 tracking-wider group"
            >
              <span className="relative z-10">{item.label}</span>
              <span className="absolute inset-0 bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          ))}
          <Link
            href="/workflow"
            className={`px-4 py-2 bg-[#FFD700] hover:bg-[#FFE44D] text-black font-semibold rounded transition-all duration-500 tracking-wider ${
              scrollY > 50
                ? 'text-xs'
                : 'text-base px-6 py-3'
            }`}
          >
            START NOW
          </Link>
        </div>
      </div>
    </nav>
  )
}

