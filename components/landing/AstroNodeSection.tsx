'use client'

import Image from 'next/image'

export default function AstroNodeSection() {
  return (
    <section className="py-32 px-8 bg-[#0a0a0a] relative overflow-hidden">
      <div className="max-w-[1920px] mx-auto flex items-center justify-center">
        <div className="relative w-[200px] h-[200px] rounded-lg shadow-xl overflow-hidden">
          <Image
            src="/images/landing/682ee1e4018d126165811a7b_Astro.avif"
            alt="Astro Video"
            fill
            className="object-cover"
            sizes="200px"
          />
        </div>
      </div>
    </section>
  )
}

