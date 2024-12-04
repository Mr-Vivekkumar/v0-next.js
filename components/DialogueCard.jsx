import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'

export default function DialogueCard({ dialogue, artistType, onApprove, showConfirmation, setShowConfirmation }) {
  const [localDialogue, setLocalDialogue] = useState(dialogue)

  if (!dialogue || !dialogue.dialogue) {
    return <div>Loading...</div>;
  }

  const handleApprove = () => {
    const updatedData = {
      character: localDialogue.character,
      dialogue: {
        original: localDialogue.dialogue?.original,
        translated: localDialogue.dialogue?.translated,
        adapted: localDialogue.dialogue?.adapted
      }
    }
    onApprove(dialogue._id, updatedData)
    setShowConfirmation(false)
  }

  const handleRewrite = () => {
    setLocalDialogue(dialogue)
    setShowConfirmation(false)
  }

  const handleLocalChange = (field, value) => {
    if (!localDialogue) return;
    setLocalDialogue(prev => ({
      ...prev,
      ...(field.includes('.') 
        ? { dialogue: { ...prev.dialogue, [field.split('.')[1]]: value } }
        : { [field]: value }
      )
    }))
  }

  return (
    <div className="relative bg-white rounded-lg p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium">Dialogue {dialogue.index}</span>
          <span className="text-gray-500">
            {dialogue.timeStart} - {dialogue.timeEnd}
          </span>
        </div>
        {artistType === 'transcriptor' ? (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Character:</Label>
            <Input
              className="w-full"
              value={localDialogue.character}
              onChange={(e) => handleLocalChange('character', e.target.value)}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Character</Label>
            <div className="p-2 bg-gray-50 rounded">
              {dialogue.character}
            </div>
          </div>
        )}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Original</Label>
          {artistType === 'transcriptor' ? (
            <Textarea
              className="w-full p-2 bg-gray-50 rounded resize-none"
              value={localDialogue.dialogue?.original}
              onChange={(e) => handleLocalChange('dialogue.original', e.target.value)}
              rows={3}
            />
          ) : (
            <div className="p-2 bg-gray-50 rounded">
              {dialogue.dialogue?.original}
            </div>
          )}
        </div>
        {artistType !== 'transcriptor' && (
          <>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Translated</Label>
              <div className="p-2 bg-gray-50 rounded">
                {dialogue.dialogue?.translated}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Adapted</Label>
              <div className="p-2 bg-gray-50 rounded">
                {dialogue.dialogue?.adapted}
              </div>
            </div>
          </>
        )}
      </div>
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0 bg-white rounded-lg shadow-lg"
          >
            <div className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Confirm Action</h3>
              <p className="text-sm text-gray-600">
                Do you want to approve or rewrite this dialogue?
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={handleRewrite} 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <X className="mr-2 h-4 w-4" /> Rewrite
                </Button>
                <Button 
                  onClick={handleApprove} 
                  className="w-full justify-start bg-green-500 hover:bg-green-600"
                >
                  <Check className="mr-2 h-4 w-4" /> Approve
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

