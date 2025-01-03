"use client"

import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  VisibilitySelector,
  type VisibilityType
} from "./chat/visibility-selector"
import { ShareIcon } from "./chat/icons"

interface ChatHeaderProps {
  chatId: string
  selectedModelId: string
  selectedVisibilityType: VisibilityType
  isReadonly: boolean
}

export function ChatHeader({
  chatId,
  selectedModelId,
  selectedVisibilityType,
  isReadonly
}: ChatHeaderProps) {
  const router = useRouter()
  const { toast } = useToast()

  return (
    <div className="bg-background sticky top-0 z-50 flex flex-row items-center justify-between gap-2 border-b px-4 py-2">
      <div className="flex flex-row items-center gap-2">
        <Select
          value={selectedModelId}
          onValueChange={value => {
            router.push(`/chat/${chatId}?model=${value}`)
          }}
          disabled={isReadonly}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
            <SelectItem value="gpt-3.5-turbo">GPT-3.5</SelectItem>
          </SelectContent>
        </Select>

        {!isReadonly && (
          <VisibilitySelector
            chatId={chatId}
            selectedVisibilityType={selectedVisibilityType}
          />
        )}
      </div>

      <div className="flex flex-row items-center gap-2">
        <Button
          variant="outline"
          className="gap-2"
          onClick={async () => {
            await navigator.clipboard.writeText(
              `${window.location.origin}/chat/${chatId}`
            )
            toast({
              title: "Success",
              description: "Copied share link to clipboard!"
            })
          }}
        >
          <ShareIcon />
          Share
        </Button>
      </div>
    </div>
  )
}
