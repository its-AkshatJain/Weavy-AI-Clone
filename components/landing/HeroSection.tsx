'use client'

import Link from 'next/link'
import MovableNodes from './MovableNodes'

interface HeroSectionProps {
  isVisible: boolean
}

export default function HeroSection({ isVisible }: HeroSectionProps) {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#f5f5f5] pt-20 sm:pt-24 md:pt-28 lg:pt-32"
    >
      {/* Light grey background with grid */}
      <div
        className="absolute inset-0 bg-[#f5f5f5]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Main Hero Content */}
      <div
        className={`relative z-10 max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="pt-8 sm:pt-12 md:pt-16 lg:pt-20 pb-8 sm:pb-12 md:pb-16 lg:pb-20">
          <div className='flex flex-col md:flex-row md:items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16 2xl:gap-32'>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium leading-[1.1] tracking-tight text-black font-display flex-shrink-0">
              Weavy
            </h1>
            <div className='md:flex-1'>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight text-black mb-3 sm:mb-4 md:mb-6 font-display">
                Artistic Intelligence
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-black/70 max-w-4xl leading-relaxed">
                Turn your creative vision into scalable workflows. Access all AI models and professional editing tools in one node based platform.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Movable Connected Nodes */}
      <div className="relative z-10 w-full px-4 sm:px-6 md:px-8">
        <MovableNodes isVisible={isVisible} />
      </div>
    </section>
  )
}

