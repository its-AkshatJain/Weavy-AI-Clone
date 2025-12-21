'use client'

import Image from 'next/image'

export default function AstroNodeSection() {
  return (
    <div className="h-screen px-4 md:px-8 relative overflow-hidden flex items-center">
      <div className="max-w-[1920px] mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 h-full">
          {/* LEFT SIDEBAR - EDITOR CONTROLS */}
          <div className="w-full lg:w-80 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 md:p-6 overflow-y-auto">
            {/* Title Sequence */}
            <div className="mb-8">
              <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Title sequence</h3>
            </div>

            {/* Layers Section */}
            <div className="mb-8">
              <h4 className="text-white/70 text-xs font-semibold mb-3 uppercase tracking-wider">Layers</h4>
              <div className="space-y-2">
                {['CANVAS', 'WALKIE TALKIE', 'TEXT LAYER', 'ASTRONAUT', 'SPACESHIP'].map((layer, index) => (
                  <div
                    key={index}
                    className={`px-3 py-2 rounded text-xs font-mono ${
                      layer === 'ASTRONAUT' 
                        ? 'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30' 
                        : 'bg-[#2a2a2a] text-white/80 hover:bg-[#333] cursor-pointer'
                    }`}
                  >
                    {layer === 'TEXT LAYER' ? 'T' : layer}
                  </div>
                ))}
              </div>
            </div>

            {/* Properties Section - Left Half */}
            <div className="space-y-6">
              {/* Dimensions */}
              <div>
                <h4 className="text-white/70 text-xs font-semibold mb-3 uppercase tracking-wider">Dimensions</h4>
                <div className="space-y-2 text-xs font-mono text-white/60">
                  <div className="flex justify-between">
                    <span>W</span>
                    <span className="text-white">1024</span>
                  </div>
                  <div className="flex justify-between">
                    <span>H</span>
                    <span className="text-white">1240</span>
                  </div>
                </div>
              </div>

              {/* Position */}
              <div>
                <h4 className="text-white/70 text-xs font-semibold mb-3 uppercase tracking-wider">Position</h4>
                <div className="space-y-2 text-xs font-mono text-white/60">
                  <div className="flex justify-between">
                    <span>X</span>
                    <span className="text-white">240</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Y</span>
                    <span className="text-white">724</span>
                  </div>
                </div>
              </div>

              {/* Rotation */}
              <div>
                <h4 className="text-white/70 text-xs font-semibold mb-3 uppercase tracking-wider">Rotation</h4>
                <div className="text-xs font-mono text-white">90°</div>
              </div>
            </div>
          </div>

          {/* MAIN CANVAS AREA - CENTER */}
          <div className="flex-1 relative bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg overflow-hidden flex items-center justify-center">
            {/* Desert Background with Astronaut */}
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 via-orange-900/10 to-yellow-900/20">
                {/* Desert-like gradient background */}
              </div>
              
              {/* Astronaut Image */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="relative w-[250px] h-[250px] md:w-[400px] md:h-[400px] mb-4">
                  <Image
                    src="/images/landing/682ee1e4018d126165811a7b_Astro.avif"
                    alt="Astronaut"
                    fill
                    className="object-contain"
                    quality={100}
                  />
                </div>
                
                {/* Directed by Text */}
                <div className="text-center mt-4">
                  <div className="text-white/90 text-xs md:text-sm font-mono mb-1">Directed by</div>
                  <div className="text-white text-base md:text-lg font-semibold">Michael Abernathy</div>
                </div>
              </div>

              {/* Phone Image - Positioned in corner */}
              <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 w-[120px] h-[180px] md:w-[200px] md:h-[300px]">
                <Image
                  src="/images/landing/682eecb4b45672741cafa0f6_phone.avif"
                  alt="Phone"
                  fill
                  className="object-contain"
                  quality={100}
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR - EDITOR CONTROLS */}
          <div className="w-full lg:w-80 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 md:p-6 overflow-y-auto">
            {/* Additional Layers */}
            <div className="mb-8">
              <h4 className="text-white/70 text-xs font-semibold mb-3 uppercase tracking-wider">Layers</h4>
              <div className="space-y-2">
                {['TEXT LAYER', 'TEXT LAYER'].map((layer, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 rounded text-xs font-mono bg-[#2a2a2a] text-white/80 hover:bg-[#333] cursor-pointer"
                  >
                    T
                  </div>
                ))}
              </div>
            </div>

            {/* Properties Section - Right Half */}
            <div className="space-y-6">
              {/* Opacity */}
              <div>
                <h4 className="text-white/70 text-xs font-semibold mb-3 uppercase tracking-wider">Opacity</h4>
                <div className="text-xs font-mono text-white">100%</div>
              </div>

              {/* Blend Mode */}
              <div>
                <h4 className="text-white/70 text-xs font-semibold mb-3 uppercase tracking-wider">Blend Mode</h4>
                <div className="text-xs font-mono text-white">NORMAL</div>
              </div>

              {/* Font */}
              <div>
                <h4 className="text-white/70 text-xs font-semibold mb-3 uppercase tracking-wider">Font</h4>
                <div className="text-xs font-mono text-white">JETBRAINS MONO</div>
              </div>

              {/* Style */}
              <div>
                <h4 className="text-white/70 text-xs font-semibold mb-3 uppercase tracking-wider">Style</h4>
                <div className="space-y-2 text-xs font-mono text-white/60">
                  <div className="flex justify-between">
                    <span>SIZE</span>
                    <span className="text-white">MEDIUM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>12</span>
                    <span className="text-white">FILL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

