import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { z } from 'zod'

const workflowSchema = z.object({
  name: z.string().min(1, 'Workflow name is required'),
  nodes: z.array(z.any()),
  edges: z.array(z.any()),
})

export async function GET() {
  try {
    const client = await clientPromise
    
    const dbName = process.env.MONGODB_DB_NAME || undefined
    const db = dbName ? client.db(dbName) : client.db()
    const collection = db.collection('workflows')

    const workflows = await collection
      .find({})
      .sort({ updatedAt: -1 })
      .toArray()

    return NextResponse.json({
      workflows: workflows.map((w) => ({
        id: w._id.toString(),
        name: w.name,
        createdAt: w.createdAt,
        updatedAt: w.updatedAt,
      })),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch workflows',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = workflowSchema.parse(body)

    const client = await clientPromise
    const dbName = process.env.MONGODB_DB_NAME || undefined
    const db = dbName ? client.db(dbName) : client.db()
    const collection = db.collection('workflows')

    const now = new Date()
    const workflow = {
      name: validatedData.name,
      nodes: validatedData.nodes,
      edges: validatedData.edges,
      createdAt: now,
      updatedAt: now,
    }

    const result = await collection.insertOne(workflow)

    return NextResponse.json({
      id: result.insertedId.toString(),
      name: validatedData.name,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    })
  } catch (error) {    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to create workflow',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
