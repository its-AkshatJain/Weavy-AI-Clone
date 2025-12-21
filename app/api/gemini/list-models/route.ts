import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'NEXT_PUBLIC_GEMINI_API_KEY is not configured' },
        { status: 500 }
      )
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
    })

    // List available models
    const list = await ai.models.list()
    const modelNames: string[] = []
    const generateContentModels: string[] = []
    
    // Iterate through the pager to get all models
    for await (const model of list) {
      if (model.name) {
        modelNames.push(model.name)
        // Filter for models that support generateContent (not embeddings, imagen, etc.)
        if (model.name.includes('gemini') && !model.name.includes('embedding') && !model.name.includes('imagen') && !model.name.includes('veo') && !model.name.includes('gemma')) {
          generateContentModels.push(model.name)
        }
      }
    }

    return NextResponse.json({ 
      models: modelNames,
      generateContentModels: generateContentModels, // Filtered list for LLM use
      message: 'Available models for your API key',
      recommended: 'models/gemini-2.5-flash-lite' // Best for free tier
    })
  } catch (error) {
    console.error('Error listing models:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to list models',
        suggestion: 'Check your API key and ensure billing is enabled (even for free tier)'
      },
      { status: 500 }
    )
  }
}

