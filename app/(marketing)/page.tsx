'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import Navigation from '@/components/landing/Navigation'
import HeroSection from '@/components/landing/HeroSection'
import AIModelsSection from '@/components/landing/AIModelsSection'
import ToolsSection from '@/components/landing/ToolsSection'
import AstroNodeSection from '@/components/landing/AstroNodeSection'
import Footer from '@/components/landing/Footer'
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
    <div className="min-h-screen bg-[#0a0a0a] text-white">

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

      {/* Astro Node Section - After 3rd section */}
      <AstroNodeSection />

      {/* Section: Control the Outcome */}
      <section
        ref={(el) => {
          sectionRefs.current['control'] = el
        }}
        className="py-32 px-8 bg-[#0a0a0a] relative overflow-hidden"
      >
        <div className="max-w-[1920px] mx-auto text-center">
          <div
            className={`transition-all duration-1000 ${
              isVisible['control']
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-20'
            }`}
          >
            <h2 className="text-6xl md:text-7xl font-bold mb-6 text-white leading-tight font-display">
              Control the Outcome
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Layers, type, and blends—all the tools to bring your wildest ideas to life. Your creativity, our compositing power.
            </p>
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
            <h2 className="text-5xl md:text-6xl font-bold mb-8 text-black leading-tight font-display">
              Maximize your team ability, by automatically generating a simplified UI
            </h2>
            <div className="flex items-center justify-center gap-4 text-3xl md:text-4xl font-bold text-black font-display">
              <span>From Workflow</span>
              <div className="w-16 h-1 bg-black/20" />
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
        className="py-32 px-8 bg-[#0f0f0f] relative overflow-hidden"
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
          </div>
        </div>
      </section>

      {/* Section: Artificial Intelligence + Human Creativity */}
      <section
        ref={(el) => {
          sectionRefs.current['ai-creativity'] = el
        }}
        className="py-32 px-8 bg-[#0a0a0a] relative overflow-hidden"
      >
        <div className="max-w-4xl mx-auto text-center relative z-10">
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
            <p className="text-xl text-white/70 mb-12 leading-relaxed">
              Weavy is a new way to create. We're bridging the gap between AI capabilities and human creativity, to continue the tradition of craft in artistic expression. We call it{' '}
              <span className="text-white font-semibold">Artistic Intelligence</span>.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/workflow"
                className="px-8 py-4 bg-[#FFD700] hover:bg-[#FFE44D] text-black text-base font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#FFD700]/30"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

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
