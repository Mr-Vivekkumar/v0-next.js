import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PUT(request, { params }) {
  const { id } = await params
  let db

  try {
    ({ db } = await connectToDatabase())
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json({ message: 'Database connection error' }, { status: 500 })
  }

  let body
  try {
    body = await request.json()
  } catch (error) {
    console.error('Invalid JSON in request body:', error)
    return NextResponse.json({ message: 'Invalid JSON in request body' }, { status: 400 })
  }

  // Remove _id from body if it exists to prevent immutable field error
  const { _id, ...updateData } = body

  try {
    if (!ObjectId.isValid(id)) {
      console.warn(`Invalid dialogue ID: ${id}`)
      return NextResponse.json({ message: 'Invalid dialogue ID' }, { status: 400 })
    }

    // Convert string ID to ObjectId
    const objectId = new ObjectId(id)
    console.log('Searching for dialogue with _id:', objectId.toString())

    // First, find the document
    const existingDocument = await db.collection('dialogues').findOne({ _id: objectId })

    if (!existingDocument) {
      console.warn(`Dialogue not found: ${id}`)
      return NextResponse.json({ message: 'Dialogue not found' }, { status: 404 })
    }

    // If document exists, proceed with update
    const result = await db.collection('dialogues').updateOne(
      { _id: objectId },
      { $set: updateData }
    )

    console.log('MongoDB update result:', result)

    if (result.matchedCount === 0) {
      console.warn(`No document matched for update: ${id}`)
      return NextResponse.json({ message: 'No document matched for update' }, { status: 404 })
    }

    if (result.modifiedCount === 0) {
      console.warn(`Document found but not modified: ${id}`)
      return NextResponse.json({ message: 'Document found but not modified' }, { status: 200 })
    }

    // Fetch the updated document
    const updatedDocument = await db.collection('dialogues').findOne({ _id: objectId })

    return NextResponse.json(updatedDocument)

  } catch (error) {
    console.error('Error updating dialogue:', error)
    return NextResponse.json(
      { 
        message: 'Error updating dialogue', 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, 
      { status: 500 }
    )
  }
}

