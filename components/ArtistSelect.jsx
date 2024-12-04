import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Languages, Mic } from 'lucide-react'

export default function ArtistSelect({ onSelect }) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Select Artist Type</CardTitle>
        <CardDescription className="text-center">Choose your role to continue</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <Button
          variant="outline"
          className="h-32 flex flex-col gap-2"
          onClick={() => onSelect('transcriptor')}
        >
          <Pencil className="h-8 w-8" />
          <span>Transcriptor</span>
        </Button>
        <Button
          variant="outline"
          className="h-32 flex flex-col gap-2"
          onClick={() => onSelect('translator')}
        >
          <Languages className="h-8 w-8" />
          <span>Translator</span>
        </Button>
        <Button
          variant="outline"
          className="h-32 flex flex-col gap-2"
          onClick={() => onSelect('voice-over')}
        >
          <Mic className="h-8 w-8" />
          <span>Voice Over</span>
        </Button>
      </CardContent>
    </Card>
  )
}

