import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { z } from 'zod'
import type { GeminiApiRequest } from '@/types'

const requestSchema = z.object({
  model: z.string().min(1),
  prompt: z.string().min(1),
  systemPrompt: z.string().optional(),
  images: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
  let requestedModel = 'gemini-pro' // Default for error messages
  
  try {
    const body = await request.json()
    
    // Validate request with Zod
    const validatedData = requestSchema.parse(body)
    const { model, prompt, systemPrompt, images } = validatedData
    requestedModel = model // Store for error messages

    // Get API key from environment
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'NEXT_PUBLIC_GEMINI_API_KEY is not configured' },
        { status: 500 }
      )
    }

    // Initialize Gemini with the new API
    const ai = new GoogleGenAI({
      apiKey: apiKey,
    })
    
    // Map model names to correct API model identifiers (2025 naming)
    // Models need the 'models/' prefix as shown in the API response
    const modelMap: Record<string, string> = {
      'gemini-pro': 'models/gemini-2.5-flash',
      'gemini-pro-vision': 'models/gemini-2.5-flash',
      'gemini-1.5-flash': 'models/gemini-2.5-flash',
      'gemini-1.5-pro': 'models/gemini-2.5-pro',
      'gemini-2.5-flash': 'models/gemini-2.5-flash',
      'gemini-2.5-pro': 'models/gemini-2.5-pro',
      'gemini-2.5-flash-lite': 'models/gemini-2.5-flash-lite', // Best for Free Tier
      'gemini-3-flash': 'models/gemini-3-flash-preview',
      'gemini-3-pro-preview': 'models/gemini-3-pro-preview',
      'gemini-lite': 'models/gemini-2.5-flash-lite',
      // Direct model names (with models/ prefix)
      'models/gemini-2.5-flash': 'models/gemini-2.5-flash',
      'models/gemini-2.5-pro': 'models/gemini-2.5-pro',
      'models/gemini-2.5-flash-lite': 'models/gemini-2.5-flash-lite',
      'models/gemini-3-flash-preview': 'models/gemini-3-flash-preview',
      'models/gemini-3-pro-preview': 'models/gemini-3-pro-preview',
    }
    
    // If model already has 'models/' prefix, use it directly, otherwise map it
    const actualModel = model.startsWith('models/') 
      ? model 
      : (modelMap[model] || 'models/gemini-2.5-flash-lite')

    // Build the prompt
    let fullPrompt = prompt
    if (systemPrompt) {
      fullPrompt = `${systemPrompt}\n\n${prompt}`
    }

    // Handle multimodal input (text + images)
    if (images && images.length > 0) {
      // For vision models, build contents array with parts
      const parts: any[] = []
      
      // Add text part
      parts.push({ text: fullPrompt })
      
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

      const response = await ai.models.generateContent({
        model: actualModel,
        contents: parts,
      })

      return NextResponse.json({ text: response.text })
    } else {
      // Text-only generation - contents is just a string
      const response = await ai.models.generateContent({
        model: actualModel,
        contents: fullPrompt,
      })

      return NextResponse.json({ text: response.text })
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
      // Extract user-friendly error message
      let errorMessage = error.message
      
      // Handle specific Gemini API errors
      if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        errorMessage = `Model "${requestedModel}" is not available. Please check your API key has access to Gemini models. Try using a different model or verify your API key.`
      } else if (errorMessage.includes('API key') || errorMessage.includes('API_KEY')) {
        errorMessage = 'Invalid API key. Please check your NEXT_PUBLIC_GEMINI_API_KEY in .env.local'
      } else if (errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
        errorMessage = 'API quota exceeded. Please try again later or check your usage limits.'
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}

