import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params
    const id = resolvedParams.id

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid workflow ID format' }, { status: 400 })
    }

    const client = await clientPromise
    const dbName = process.env.MONGODB_DB_NAME || undefined
    const db = dbName ? client.db(dbName) : client.db()
    const collection = db.collection('workflows')

    const workflow = await collection.findOne({ _id: new ObjectId(id) })

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: workflow._id.toString(),
      name: workflow.name,
      nodes: workflow.nodes,
      edges: workflow.edges,
      createdAt: workflow.createdAt,
      updatedAt: workflow.updatedAt,
    })
  } catch (error) {
    console.error('Error fetching workflow:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch workflow',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params
    const id = resolvedParams.id

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid workflow ID format' }, { status: 400 })
    }

    const body = await request.json()
    const { name, nodes, edges } = body

    if (!name || !nodes || !edges) {
      return NextResponse.json(
        { error: 'Missing required fields: name, nodes, edges' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const dbName = process.env.MONGODB_DB_NAME || undefined
    const db = dbName ? client.db(dbName) : client.db()
    const collection = db.collection('workflows')

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          nodes,
          edges,
          updatedAt: new Date(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    const updatedWorkflow = await collection.findOne({ _id: new ObjectId(id) })

    return NextResponse.json({
      id: updatedWorkflow!._id.toString(),
      name: updatedWorkflow!.name,
      nodes: updatedWorkflow!.nodes,
      edges: updatedWorkflow!.edges,
      createdAt: updatedWorkflow!.createdAt,
      updatedAt: updatedWorkflow!.updatedAt,
    })
  } catch (error) {
    console.error('Error updating workflow:', error)
    return NextResponse.json(
      {
        error: 'Failed to update workflow',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params
    const id = resolvedParams.id

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid workflow ID format' }, { status: 400 })
    }

    const client = await clientPromise
    const dbName = process.env.MONGODB_DB_NAME || undefined
    const db = dbName ? client.db(dbName) : client.db()
    const collection = db.collection('workflows')

    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting workflow:', error)
    return NextResponse.json(
      {
        error: 'Failed to delete workflow',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
