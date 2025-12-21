'use client'

import { useEffect, useRef, useState } from 'react'
import { X, ArrowRightLeft, ToggleLeft } from 'lucide-react'
import Image from 'next/image'
import Navigation from '@/components/landing/Navigation'
import HeroSection from '@/components/landing/HeroSection'
import AIModelsSection from '@/components/landing/AIModelsSection'
import ToolsSection from '@/components/landing/ToolsSection'
import AstroNodeSection from '@/components/landing/AstroNodeSection'
import Link from 'next/link'

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({})
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)

      // Intersection Observer for scroll animations
      Object.keys(sectionRefs.current).forEach((key) => {
        const element = sectionRefs.current[key]
        if (element) {
          const rect = element.getBoundingClientRect()
          const isInView = rect.top < window.innerHeight * 0.8 && rect.bottom > 0
          if (isInView) {
            setIsVisible((prev) => ({ ...prev, [key]: true }))
          }
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen text-white">

      {/* Navigation */}
      <Navigation scrollY={scrollY} />

      {/* Hero Section */}
      <div
        ref={(el) => {
          sectionRefs.current['hero'] = el
        }}
      >
        <HeroSection
          isVisible={isVisible['hero'] || false}
        />
      </div>

      {/* Section: Use all AI models */}
      <div
        ref={(el) => {
          sectionRefs.current['ai-models'] = el
        }}
      >
        <AIModelsSection isVisible={isVisible['ai-models'] || false} />
      </div>

      {/* Section: Professional Tools */}
      <div
        ref={(el) => {
          sectionRefs.current['tools'] = el
        }}
      >
        <ToolsSection isVisible={isVisible['tools'] || false} />
      </div>

      {/* Section: Control the Outcome */}
      <section
        ref={(el) => {
          sectionRefs.current['control'] = el
        }}
        className="py-32 px-8 relative overflow-hidden"
      >
        <div className="max-w-[1920px] mx-auto text-center">
          <div
            className={`transition-all duration-1000 ${
              isVisible['control']
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-20'
            }`}
          >
            <h2 className="text-6xl md:text-7xl font-bold mb-6 text-black leading-tight font-display">
              Control the Outcome
            </h2>
            <p className="text-xl text-black max-w-3xl mx-auto leading-relaxed">
              Layers, type, and blends—all the tools to bring your wildest ideas to life. Your creativity, our compositing power.
            </p>
          </div>
        </div>
      </section>

      {/* Astro Node Section - After 3rd section */}
      <section className="py-32 px-8">
        <div className="max-w-[1920px] mx-auto">
          <div className="bg-black mx-8 rounded-[20px] overflow-hidden">
            <AstroNodeSection />
          </div>
        </div>
      </section>

      {/* Section: Maximize your team ability */}
      <section
        ref={(el) => {
          sectionRefs.current['maximize'] = el
        }}
        className="py-32 px-8 bg-[#f5f5f5] relative"
      >
        <div className="max-w-[1920px] mx-auto">
          <div
            className={`text-center mb-12 transition-all duration-1000 ${
              isVisible['maximize']
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-20'
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black leading-tight font-display">
              Maximize your team ability, by automatically generating a simplified UI
            </h2>
            <div className="flex items-center justify-center gap-4 text-5xl md:text-6xl font-bold text-black font-display mb-12">
              <span>From Workflow</span>
              <ToggleLeft className="w-16 h-16 text-black" />
              <span>to App Mode</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Explore Our Workflows */}
      <section
        ref={(el) => {
          sectionRefs.current['workflows'] = el
        }}
        className="py-32 px-8 bg-[#252525] relative overflow-hidden"
      >
        <div className="max-w-[1920px] mx-auto">
          <div
            className={`text-center mb-20 transition-all duration-1000 ${
              isVisible['workflows']
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-20'
            }`}
          >
            <h2 className="text-6xl md:text-7xl font-bold mb-6 text-white leading-tight font-display">
              Explore Our Workflows
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              From multi-layer compositing to matte manipulation, Weavy keeps up with your creativity with all the editing tools you recognize and rely on.
            </p>
            {/* Images Side by Side */}
            <div className="flex flex-col md:flex-row gap-8 justify-center items-center max-w-6xl mx-auto">
              <div className="relative w-full md:w-1/2 aspect-square max-w-md">
                <Image
                  src="/images/landing/6825b0ac04c55a803826a6e5_Relight - Product.avif"
                  alt="Relight Product"
                  fill
                  className="object-contain rounded-lg"
                  quality={100}
                />
              </div>
              <div className="relative w-full md:w-1/2 aspect-square max-w-md">
                <Image
                  src="/images/landing/6825b0acc901ee5c718efc90_Wan Lora - Rotate.avif"
                  alt="Wan Lora Rotate"
                  fill
                  className="object-contain rounded-lg"
                  quality={100}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Artificial Intelligence + Human Creativity + Footer */}
      <section
        ref={(el) => {
          sectionRefs.current['ai-creativity'] = el
        }}
        className="bg-[#aeb3a9] relative overflow-hidden"
      >
        <div className="py-32 px-8">
          <div className="max-w-[1920px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
              {/* LEFT SIDE - AI + Creativity Text */}
              <div className="flex-1 lg:max-w-2xl">
                <div
                  className={`transition-all duration-1000 ${
                    isVisible['ai-creativity']
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-20'
                  }`}
                >
                  <h2 className="text-6xl md:text-7xl font-bold mb-8 text-white leading-tight font-display">
                    Artificial Intelligence
                    <br />
                    <span className="text-5xl md:text-6xl">+</span>
                    <br />
                    Human Creativity
                  </h2>
                  <p className="text-xl text-white/70 leading-relaxed">
                    Weavy is a new way to create. We're bridging the gap between AI capabilities and human creativity, to continue the tradition of craft in artistic expression. We call it{' '}
                    <span className="text-white font-semibold">Artistic Intelligence</span>.
                  </p>
                </div>
              </div>

              {/* RIGHT SIDE - Footer Links */}
              <div className="flex-1 lg:max-w-xl">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
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

                  {/* Connect & Resources */}
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-4">Connect</h3>
                    <ul className="space-y-2 mb-6">
                      <li>
                        <Link href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                          Collective
                        </Link>
                      </li>
                    </ul>
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

                {/* Get Started Button - Below Footer on Right */}
                <div className="mb-12">
                  <Link
                    href="/workflow"
                    className="inline-block px-8 py-4 bg-[#FFD700] hover:bg-[#FFE44D] text-black text-base font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#FFD700]/30"
                  >
                    Get Started
                  </Link>
                </div>

                {/* SOC 2 Certification */}
                <div className="mb-8 pb-8 border-b border-white/10">
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
                <div className="flex flex-col gap-4">
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
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float-3d {
          0%, 100% {
            transform: rotate(3deg) translateY(0px);
          }
          50% {
            transform: rotate(-3deg) translateY(-20px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.2;
          }
        }

        .animate-float-3d {
          animation: float-3d 8s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
