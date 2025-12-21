'use client'

import Image from 'next/image'

interface ToolsSectionProps {
  isVisible: boolean
}

export default function ToolsSection({ isVisible }: ToolsSectionProps) {
  const tools = [
    { name: 'Invert', position: 'right', top: '10%', image: null },
    { name: 'outpaint', position: 'left', top: '25%', image: null },
    { name: 'Crop', position: 'left', top: '40%', image: null },
    { name: 'Inpaint', position: 'left', top: '55%', image: null },
    { name: 'Mask extractor', position: 'right', top: '25%', image: null },
    { name: 'upscale', position: 'left', top: '70%', image: null },
    { name: 'z depth extractor', position: 'right', top: '40%', image: null },
    { name: 'image describer', position: 'right', top: '55%', image: '/images/landing/6825ab42a8f361a9518d5a7f_Image describer@2x.avif' },
    { name: 'channels', position: 'right', top: '70%', image: '/images/landing/682245646909d06ed8a17f4d_Channels@2x.avif' },
    { name: 'Painter', position: 'right', top: '85%', image: null },
    { name: 'Relight', position: 'left', top: '85%', image: '/images/landing/6825b0ac04c55a803826a6e5_Relight - Product.avif' },
  ]

  return (
    <section className="py-32 px-8 bg-[#f5f5f5] relative">
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 max-w-[1920px] mx-auto">
        <div
          className={`text-center mb-20 transition-all duration-1000 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-20'
          }`}
        >
          <h2 className="text-6xl md:text-7xl font-bold mb-6 text-black leading-tight font-display">
            With all the professional tools
            <br />
            you rely on
          </h2>
          <p className="text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            In one seamless workflow
          </p>
        </div>

        {/* Central Image with Tools Around */}
        <div className="relative max-w-5xl mx-auto min-h-[600px]">
          {/* Central Image Placeholder - Use Default image */}
          <div
            className={`relative w-full aspect-square max-w-md mx-auto mb-12 transition-all duration-1000 ${
              isVisible
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-95'
            }`}
          >
            <div className="absolute inset-0 rounded-2xl shadow-2xl overflow-hidden">
              <Image
                src="/images/landing/68223c9e9705b88c35e76dec_Default@2x.avif"
                alt="Product"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
          </div>

          {/* Floating Tool Buttons */}
          {tools.map((tool, index) => (
            <div
              key={index}
              className={`absolute ${tool.position === 'left' ? 'left-0' : 'right-0'} group cursor-pointer transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-x-0'
                  : `opacity-0 ${tool.position === 'left' ? '-translate-x-10' : 'translate-x-10'}`
              }`}
              style={{
                top: tool.top,
                transitionDelay: `${index * 0.1}s`,
              }}
            >
              <div className="px-4 py-2 bg-white border border-black/10 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-110 hover:border-[#FFD700] flex items-center gap-2">
                {tool.image && (
                  <div className="relative w-6 h-6 rounded overflow-hidden">
                    <Image
                      src={tool.image}
                      alt={tool.name}
                      fill
                      className="object-cover"
                      sizes="24px"
                    />
                  </div>
                )}
                <span className="text-sm font-medium text-black group-hover:text-[#FFD700] transition-colors">
                  {tool.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
