'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

interface AIModelsSectionProps {
  isVisible?: boolean
}

export default function AIModelsSection({ isVisible }: AIModelsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const images = [
    '/images/landing/6825887d65bf65cc5194ac05_Imagen 3.avif',
    '/images/landing/6825887d618a9071dd147d5f_SD 3.5.avif',
    '/images/landing/6825887e82ac8a8bb8139ebd_GPT img 1.avif',
    '/images/landing/6825887eda73c12eaa4c3ed8_Recraft V3.avif',
    '/images/landing/68258880f266d11a0748ab63_Minimax image 01.avif'
  ]

  /** TEXT SCROLL
   * Moves text up slowly while pinned
   * This ensures text finishes before section releases at 100%
   */
  const textY = useTransform(scrollYProgress, [0, 0.8], ['0%', '-65%'])

  const modelNames = [
    'GPT img 1',
    'Wan',
    'SD 3.5',
    'Runway Gen-4',
    'Imagen 3',
    'Veo 3',
    'Recraft V3',
    'Kling',
    'Flux Pro 1.1 Ultra',
    'Minimax video',
    'Ideogram V3',
    'Luma ray 2',
    'Minimax image 01',
    'Hunyuan',
    'Bria'
  ]

  // Create color transforms for each model name - highlights sequentially as you scroll
  const modelColors = modelNames.map((_, i) => {
    const totalModels = modelNames.length
    const segmentSize = 0.8 / totalModels // Use 0.8 since text scrolls from 0 to 0.8
    const start = (i * segmentSize)
    const end = ((i + 1) * segmentSize)
    const highlightDuration = segmentSize * 0.6 // Highlight duration
    const highlightStart = start + highlightDuration * 0.5
    const highlightEnd = end - highlightDuration * 0.5

    return useTransform(
      scrollYProgress,
      [
        Math.max(0, highlightStart - highlightDuration),
        highlightStart,
        highlightEnd,
        Math.min(0.8, highlightEnd + highlightDuration)
      ],
      ['#FFFFFF', '#FFF59E', '#FFF59E', '#FFFFFF'] // White -> Yellow -> Yellow -> White
    )
  })

  // Create opacity transforms for all images at the top level (hooks must be called unconditionally)
  const imageOpacities = images.map((_, i) => {
    const segmentSize = 1 / images.length
    const start = i * segmentSize
    const end = (i + 1) * segmentSize
    const isLast = i === images.length - 1
    
    // Longer fade duration for smoother transitions with more overlap
    const fadeDuration = segmentSize * 0.2
    const fadeInStart = Math.max(0, start - fadeDuration)
    const fadeInEnd = start + fadeDuration
    const fadeOutStart = end - fadeDuration
    const fadeOutEnd = isLast ? 1 : Math.min(1, end + fadeDuration)

    // First image starts visible, last image never fades out
    if (i === 0) {
      return useTransform(
        scrollYProgress,
        [0, fadeInEnd, fadeOutStart, fadeOutEnd],
        [1, 1, 1, 0]
      )
    } else if (isLast) {
      return useTransform(
        scrollYProgress,
        [fadeInStart, fadeInEnd, fadeOutStart, 1],
        [0, 1, 1, 1] // Last image stays at opacity 1
      )
    } else {
      return useTransform(
        scrollYProgress,
        [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
        [0, 1, 1, 0]
      )
    }
  })

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full h-[300vh]"
    >
      {/* STICKY PINNED CONTAINER */}
      <div 
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        {/* BACKGROUND IMAGES */}
        <div className="absolute inset-0 w-full h-full">
          {images.map((src, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 w-full h-full"
              style={{ opacity: imageOpacities[i], zIndex: i }}
              suppressHydrationWarning
            >
              <Image
                src={src}
                alt={`AI Model ${i + 1}`}
                fill
                priority={i === 0}
                className="object-cover"
                sizes="100vw"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* TEXT CONTENT */}
        <div className="relative z-10 h-full w-full flex items-start overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full pt-8 sm:pt-12 md:pt-16 pb-8 sm:pb-12 md:pb-16">
            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-start h-full">
              {/* LEFT SIDE - FIXED */}
              <div className="flex-shrink-0 w-full lg:max-w-2xl">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold mb-4 sm:mb-6 md:mb-8 text-white leading-[1.05] font-display">
                  Use all AI models, together at last
                </h2>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white leading-[1.3]">
                  AI models and professional editing tools in one node-based platform. Turn creative vision into scalable workflows without compromising quality.
                </p>
              </div>

              {/* RIGHT SIDE - SCROLLABLE */}
              <motion.div
                style={{ y: textY }}
                className="flex-1 w-full lg:w-auto will-change-transform hidden md:block"
                suppressHydrationWarning
              >
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.05]">
                  {modelNames.map((model, index) => (
                    <motion.div
                      key={index}
                      className="mb-4 sm:mb-6 md:mb-8 last:mb-0"
                      style={{ color: modelColors[index] }}
                      suppressHydrationWarning
                    >
                      {model}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* MOBILE: Show models in a compact grid */}
              <div className="md:hidden w-full mt-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {modelNames.map((model, index) => (
                    <div
                      key={index}
                      className="text-lg sm:text-xl font-bold text-white/80 leading-tight"
                    >
                      {model}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
