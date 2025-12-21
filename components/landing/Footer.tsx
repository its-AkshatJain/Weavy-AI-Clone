'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-16 px-8 bg-[#0a0a0a]">
      <div className="max-w-[1920px] mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Get Started */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Get Started</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                  request a Demo
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                  Enterprise
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                  Trust
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                  Collective
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                  Knowledge center
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* SOC 2 Certification */}
        <div className="mb-8 pb-8 border-b border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">SOC</span>
            </div>
            <span className="text-sm font-semibold text-white">SOC 2 Type II Certified</span>
          </div>
          <p className="text-sm text-white/60">
            Your data is protected with industry-standard security controls.
          </p>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
              <span className="text-black text-xs font-bold">W</span>
            </div>
            <span className="text-lg font-semibold text-white font-display">WEAVY</span>
            <div className="w-px h-4 bg-white/20" />
            <span className="text-xs text-white/60 tracking-wider">ARTISTIC INTELLIGENCE</span>
          </div>
          <div className="text-sm text-white/40">
            <p>Weavy © 2025. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

