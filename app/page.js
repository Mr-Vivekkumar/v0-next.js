'use client'

import { useState, useEffect } from 'react'
import QACard from '@/components/QACard'
import ArtistSelect from '@/components/ArtistSelect'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'

export default function Home() {
  const [artistType, setArtistType] = useState("transcriptor")
  // const [artistType, setArtistType] = useState(null)
  const [initialDialogues, setInitialDialogues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchDialogues() {
      try {
        setLoading(true)
        const projectId = '123456789123456789123456' // Replace with your actual project ID
        const response = await fetch(`/api/dialogues/list/${projectId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch dialogues')
        }
        const data = await response.json()
        setInitialDialogues(data)
      } catch (err) {
        console.error('Error fetching dialogues:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDialogues()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <span>Loading...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (initialDialogues.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Dialogues Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>There are no dialogues available for this project.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      {!artistType ? (
        <ArtistSelect onSelect={setArtistType} />
      ) : (
        <QACard 
          artistType={artistType} 
          onBack={() => setArtistType(null)} 
          initialDialogues={initialDialogues} 
        />
      )}
    </main>
  )
}

