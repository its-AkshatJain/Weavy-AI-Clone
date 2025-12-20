import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { z } from 'zod'

const requestSchema = z.object({
  model: z.string().min(1),
  prompt: z.string().min(1),
  systemPrompt: z.string().optional(),
  images: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request with Zod
    const validatedData = requestSchema.parse(body)
    const { model, prompt, systemPrompt, images } = validatedData

    // Get API key from environment
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured' },
        { status: 500 }
      )
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey)
    const geminiModel = genAI.getGenerativeModel({ model })

    // Build the prompt
    let fullPrompt = prompt
    if (systemPrompt) {
      fullPrompt = `${systemPrompt}\n\n${prompt}`
    }

    // Handle multimodal input (text + images)
    if (images && images.length > 0) {
      // For vision models, we need to use generateContent with parts
      const parts: any[] = [{ text: fullPrompt }]
      
      // Add image parts (base64 data URLs)
      for (const imageData of images) {
        // Extract base64 data from data URL
        let base64Data = imageData
        let mimeType = 'image/jpeg'
        
        if (imageData.includes(',')) {
          const [header, data] = imageData.split(',')
          base64Data = data
          // Detect mime type from data URL
          if (header.includes('image/png')) {
            mimeType = 'image/png'
          } else if (header.includes('image/webp')) {
            mimeType = 'image/webp'
          } else if (header.includes('image/gif')) {
            mimeType = 'image/gif'
          }
        }
        
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType,
          },
        })
      }

      const result = await geminiModel.generateContent({
        contents: [{ role: 'user', parts }],
      })

      const response = result.response
      const text = response.text()

      return NextResponse.json({ text })
    } else {
      // Text-only generation
      const result = await geminiModel.generateContent(fullPrompt)
      const response = result.response
      const text = response.text()

      return NextResponse.json({ text })
    }
  } catch (error) {
    console.error('Gemini API error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || 'Failed to generate content' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

