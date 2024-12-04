import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

const sampleDialogues = [
  {
    _id: new ObjectId("6749beeda162adf485301c72"),
    index: 1,
    timeStart: "00:00:00:280",
    timeEnd: "00:00:01:280",
    character: "Nadire",
    videoUrl: "https://pub-ca2dd6ef0390446c8dda16e228d97cf6.r2.dev/Kuma%20Ep%2001/videos/Kuma%20Ep%2001_Clip_01.mp4",
    dialogue: {
      original: "-Nadire.",
      translated: "-Nadire.",
      adapted: "नादिरे।"
    },
    emotions: {
      primary: {
        emotion: "Neutral",
        intensity: 1
      },
      secondary: {
        emotion: "Neutral",
        intensity: 1
      }
    },
    direction: "Normal tone",
    lipMovements: 0,
    sceneContext: "Character speaking",
    technicalNotes: "Neutral tone",
    culturalNotes: "General conversation",
    audioUrl: "https://b575e906ed24bdc29b7a7ca951242790.r2.cloudflarestorage.com/test-bucket-2Kuma Ep 01/recordings/Kuma Ep 01_Clip_01.wav",
    status: "approved",
    recordingStatus: "pending",
    project: new ObjectId("123456789123456789123456"),
    updatedAt: new Date("2024-12-02T07:47:29.229Z")
  },
  // ... Add more sample dialogues here
];

export async function GET() {
  const { db } = await connectToDatabase()

  try {
    const existingDialogues = await db.collection('dialogues').countDocuments()

    if (existingDialogues === 0) {
      const result = await db.collection('dialogues').insertMany(sampleDialogues, { ordered: false })
      console.log(`Sample dialogues inserted. Inserted count: ${result.insertedCount}`)
      return NextResponse.json({ message: 'Database seeded with sample dialogues', insertedCount: result.insertedCount })
    } else {
      console.log(`Database already contains ${existingDialogues} dialogues`)
      return NextResponse.json({ message: 'Database already contains dialogues', count: existingDialogues })
    }
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json({ message: 'Error seeding database', error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  const { db } = await connectToDatabase()

  try {
    const body = await request.json()
    if (!Array.isArray(body)) {
      return NextResponse.json({ message: 'Invalid input: expected an array of dialogues' }, { status: 400 })
    }

    const dialogues = body.map(dialogue => ({
      ...dialogue,
      _id: new ObjectId(dialogue._id),
      project: new ObjectId(dialogue.project),
      updatedAt: new Date(dialogue.updatedAt)
    }))

    const result = await db.collection('dialogues').insertMany(dialogues, { ordered: false })
    console.log(`Dialogues inserted. Inserted count: ${result.insertedCount}`)
    return NextResponse.json({ message: 'Dialogues inserted successfully', insertedCount: result.insertedCount })
  } catch (error) {
    console.error('Error inserting dialogues:', error)
    return NextResponse.json({ message: 'Error inserting dialogues', error: error.message }, { status: 500 })
  }
}

