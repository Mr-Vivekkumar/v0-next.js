import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request) {
  const url = new URL(request.url)
  const projectId = url.pathname.split('/').pop()
  console.log('Requested project ID:', projectId)

  try {
    const { db } = await connectToDatabase()
    // console.log('Connected to database:', db.databaseName)

    let query
    if (ObjectId.isValid(projectId)) {
      query = { project: { $in: [projectId, new ObjectId(projectId)] } }
    } else {
      query = { project: projectId }
    }

    const dialogues = await db.collection('dialogues')
      .find(query)
      .sort({ videoIndex: 1, index: 1 })
      .toArray()

    // console.log('Query:', JSON.stringify(query))
    // console.log('Fetched dialogues:', JSON.stringify(dialogues, null, 2))

    if (dialogues.length === 0) {
      console.log('No dialogues found for project:', projectId)
      
      const totalDialogues = await db.collection('dialogues').countDocuments()
      console.log('Total dialogues in collection:', totalDialogues)

      if (totalDialogues > 0) {
        const sampleDialogue = await db.collection('dialogues').findOne()
        // console.log('Sample dialogue:', JSON.stringify(sampleDialogue, null, 2))
      }
    }

    return NextResponse.json(dialogues)
  } catch (error) {
    console.error('Error listing dialogues:', error)
    return NextResponse.json({ message: 'Error listing dialogues', error: error.message }, { status: 500 })
  }
}

