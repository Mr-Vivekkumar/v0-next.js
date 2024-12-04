import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useSwipeable } from 'react-swipeable'
import DialogueCard from './DialogueCard'

export default function QACard({ artistType, onBack, initialDialogues }) {
  const [dialogues, setDialogues] = useState(initialDialogues)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const videoRef = useRef(null)

  const handleApproveDialogue = async (dialogueId, updatedDialogue) => {
    try {
      const response = await fetch(`/api/dialogues/${dialogueId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'approved',
          progressStatus: 'A1',
          ...updatedDialogue
        }),
      })

      const data = await response.json()

      if (response.status === 404) {
        throw new Error(data.message || 'Dialogue not found')
      }

      if (response.status === 200) {
        console.log(`Dialogue ${dialogueId} ${data.message || "updated successfully"}`)
        
        setDialogues(prevDialogues => prevDialogues.map(d => 
          d._id === dialogueId 
            ? { ...d, ...data, status: 'approved', progressStatus: 'A1' }
            : d
        ))
        moveToNextDialogue()
      } else {
        throw new Error(data.message || 'Failed to approve dialogue')
      }
    } catch (error) {
      console.error('Error approving dialogue:', error.message)
    }
  }

  const moveToNextDialogue = () => {
    setCurrentIndex(prevIndex => {
      const nextIndex = Math.min(dialogues.length - 1, prevIndex + 1)
      if (nextIndex !== prevIndex) {
        console.log('Moving to next dialogue. New index:', nextIndex)
      }
      return nextIndex
    })
    setShowConfirmation(false)
  }

  const moveToPreviousDialogue = () => {
    setCurrentIndex(prevIndex => {
      const newIndex = Math.max(0, prevIndex - 1)
      if (newIndex !== prevIndex) {
        console.log('Moving to previous dialogue. New index:', newIndex)
      }
      return newIndex
    })
    setShowConfirmation(false)
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (!showConfirmation) {
        setShowConfirmation(true)
      }
    },
    onSwipedRight: () => {
      if (showConfirmation) {
        setShowConfirmation(false)
      } else {
        moveToPreviousDialogue()
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
    delta: 50,
    swipeDuration: 500,
  })

  useEffect(() => {
    if (videoRef.current && dialogues[currentIndex]) {
      const videoUrl = dialogues[currentIndex].videoUrl
      if (videoUrl) {
        videoRef.current.src = videoUrl
        videoRef.current.load()
      } else {
        console.error('Video URL is undefined for dialogue at index:', currentIndex)
      }
    }
  }, [currentIndex, dialogues])

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" onClick={onBack} size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Selection
          </Button>
          <span className="text-lg font-medium">Mode: {artistType}</span>
        </div>

        <div className="mb-4">
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
            {dialogues[currentIndex]?.videoUrl ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                controls
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                No video available
              </div>
            )}
          </div>
        </div>

        <div {...handlers} className="touch-pan-y">
          {dialogues[currentIndex] && (
            <DialogueCard
              key={dialogues[currentIndex]._id}
              dialogue={dialogues[currentIndex]}
              artistType={artistType}
              onApprove={handleApproveDialogue}
              showConfirmation={showConfirmation}
              setShowConfirmation={setShowConfirmation}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

