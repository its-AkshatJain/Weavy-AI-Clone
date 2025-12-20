import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Weavy - Artistic Intelligence',
  description: 'Turn your creative vision into scalable workflows',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

