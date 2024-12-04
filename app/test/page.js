'use client'

import { useState, useEffect } from 'react'

export default function TestPage() {
  const [dialogues, setDialogues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDialogues = async () => {
      try {
        const projectId = '123456789123456789123456' // Replace with your actual project ID
        const response = await fetch(`/api/dialogues/list/${projectId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch dialogues')
        }
        const data = await response.json()
        setDialogues(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDialogues()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Page: Dialogues</h1>
      {dialogues.map((dialogue) => (
        <div key={dialogue._id} className="mb-4 p-4 border rounded">
          <p>ID: {dialogue._id}</p>
          <p>Character: {dialogue.character}</p>
          <p>Original: {dialogue.dialogue.original}</p>
        </div>
      ))}
    </div>
  )
}

