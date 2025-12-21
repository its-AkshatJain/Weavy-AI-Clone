'use client'

import Image from 'next/image'

interface ToolsSectionProps {
  isVisible: boolean
}

export default function ToolsSection({ isVisible }: ToolsSectionProps) {
  const tools = [
    { name: 'Invert', position: 'right', top: '5%', leftOffset: null, rightOffset: '30px', image: null },
    { name: 'outpaint', position: 'left', top: '18%', leftOffset: '-60px', rightOffset: null, image: null },
    { name: 'Crop', position: 'left', top: '32%', leftOffset: '-200px', rightOffset: null, image: null },
    { name: 'Inpaint', position: 'left', top: '48%', leftOffset: '-40px', rightOffset: null, image: null },
    { name: 'Mask extractor', position: 'right', top: '20%', leftOffset: null, rightOffset: '-80px', image: null },
    { name: 'upscale', position: 'left', top: '62%', leftOffset: '-160px', rightOffset: null, image: null },
    { name: 'z depth extractor', position: 'right', top: '35%', leftOffset: null, rightOffset: '-200px', image: null },
    { name: 'image describer', position: 'right', top: '50%', leftOffset: null, rightOffset: '-30px', image: '/images/landing/6825ab42a8f361a9518d5a7f_Image describer@2x.avif' },
    { name: 'channels', position: 'right', top: '65%', leftOffset: null, rightOffset: '-180px', image: '/images/landing/682245646909d06ed8a17f4d_Channels@2x.avif' },
    { name: 'Painter', position: 'right', top: '78%', leftOffset: null, rightOffset: '30px', image: null },
    { name: 'Relight', position: 'left', top: '75%', leftOffset: '30px', rightOffset: null, image: '/images/landing/6825b0ac04c55a803826a6e5_Relight - Product.avif' },
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
        <div className="text-center mb-20">
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
        <div className="relative max-w-5xl h-[500px] mx-auto">
          <div className="relative w-full h-full max-w-7xl mx-auto pt-0">
            <Image
              src="/images/landing/68223c9e9705b88c35e76dec_Default@2x.avif"
              alt="Product"
              fill
              className="object-contain"
              quality={100}
              priority
              sizes="(max-width: 768px) 100vw, 1792px"
              style={{
                transform: 'scale(1.5)',
                transformOrigin: 'bottom',
              }}
            />
          </div>

          {/* Floating Tool Buttons */}
          {tools.map((tool, index) => (
            <div
              key={index}
              className={`absolute group cursor-pointer transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-x-0 translate-y-0'
                  : `opacity-0 ${tool.position === 'left' ? '-translate-x-10' : 'translate-x-10'}`
              }`}
              style={{
                top: tool.top,
                left: tool.position === 'left' ? tool.leftOffset || undefined : undefined,
                right: tool.position === 'right' ? tool.rightOffset || undefined : undefined,
                transitionDelay: `${index * 0.1}s`,
              }}
            >
              <div className="px-4 py-2 bg-white border border-black/10 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-110 hover:border-[#FFD700]">
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
