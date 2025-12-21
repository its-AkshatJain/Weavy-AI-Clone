'use client'

import Link from 'next/link'
import MovableNodes from './MovableNodes'

interface HeroSectionProps {
  isVisible: boolean
}

export default function HeroSection({ isVisible }: HeroSectionProps) {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#f5f5f5] pt-20"
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
        className={`relative z-10 max-w-[1920px] mx-auto px-8 w-full text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="m-10">
          <div className='flex gap-32 align-items-start'>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-medium leading-[1.1] tracking-tight text-black mb-4 font-display">
              Weavy
            </h1>
            <div className='text-left'>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight text-black mb-6 font-display">
                Artistic Intelligence
              </h2>
              <p className="text-xl md:text-2xl text-black/70 max-w-4xl mx-auto leading-relaxed">
                Turn your creative vision into scalable workflows. Access all AI models and professional editing tools in one node based platform.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Movable Connected Nodes */}
      <div className="relative z-10 w-full">
        <MovableNodes isVisible={isVisible} />
      </div>
    </section>
  )
}

