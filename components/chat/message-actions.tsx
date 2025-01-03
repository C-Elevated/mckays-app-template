"use client"

import { memo } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useSWRConfig } from "swr"
import { useClipboard } from "@/lib/hooks/use-clipboard"
import equal from "fast-deep-equal"

import { Vote } from "@/db/schema"
import { getMessageIdFromAnnotations } from "@/lib/utils"
import type { Message } from "@/types/message"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { CopyIcon, ThumbDownIcon, ThumbUpIcon } from "./icons"

interface MessageActionsProps {
  chatId: string
  message: Message
  vote: Vote | undefined
  isLoading: boolean
}

function PureMessageActions({
  chatId,
  message,
  vote,
  isLoading
}: MessageActionsProps) {
  const { mutate } = useSWRConfig()
  const { copyToClipboard } = useClipboard({
    successMessage: "Message copied to clipboard!"
  })
  const { toast } = useToast()

  if (isLoading) return null
  if (message.role === "user") return null
  if (message.toolInvocations && message.toolInvocations.length > 0) return null

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-row gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="text-muted-foreground h-fit px-2 py-1"
              variant="outline"
              onClick={async () => {
                await copyToClipboard(message.content as string)
              }}
            >
              <CopyIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="text-muted-foreground !pointer-events-auto h-fit px-2 py-1"
              disabled={vote?.isUpvoted}
              variant="outline"
              onClick={async () => {
                const messageId = getMessageIdFromAnnotations(message)

                const upvote = fetch("/api/vote", {
                  method: "PATCH",
                  body: JSON.stringify({
                    chatId,
                    messageId,
                    type: "up"
                  })
                })

                toast.promise(upvote, {
                  loading: "Upvoting Response...",
                  success: () => {
                    mutate<Array<Vote>>(
                      `/api/vote?chatId=${chatId}`,
                      currentVotes => {
                        if (!currentVotes) return []

                        const votesWithoutCurrent = currentVotes.filter(
                          vote => vote.messageId !== message.id
                        )

                        return [
                          ...votesWithoutCurrent,
                          {
                            chatId,
                            messageId: message.id,
                            isUpvoted: true
                          }
                        ]
                      },
                      { revalidate: false }
                    )

                    return "Upvoted Response!"
                  },
                  error: "Failed to upvote response."
                })
              }}
            >
              <ThumbUpIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Upvote Response</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="text-muted-foreground !pointer-events-auto h-fit px-2 py-1"
              variant="outline"
              disabled={vote && !vote.isUpvoted}
              onClick={async () => {
                const messageId = getMessageIdFromAnnotations(message)

                const downvote = fetch("/api/vote", {
                  method: "PATCH",
                  body: JSON.stringify({
                    chatId,
                    messageId,
                    type: "down"
                  })
                })

                toast.promise(downvote, {
                  loading: "Downvoting Response...",
                  success: () => {
                    mutate<Array<Vote>>(
                      `/api/vote?chatId=${chatId}`,
                      currentVotes => {
                        if (!currentVotes) return []

                        const votesWithoutCurrent = currentVotes.filter(
                          vote => vote.messageId !== message.id
                        )

                        return [
                          ...votesWithoutCurrent,
                          {
                            chatId,
                            messageId: message.id,
                            isUpvoted: false
                          }
                        ]
                      },
                      { revalidate: false }
                    )

                    return "Downvoted Response!"
                  },
                  error: "Failed to downvote response."
                })
              }}
            >
              <ThumbDownIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Downvote Response</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

export const MessageActions = memo(
  PureMessageActions,
  (prevProps, nextProps) => {
    if (!equal(prevProps.vote, nextProps.vote)) return false
    if (prevProps.isLoading !== nextProps.isLoading) return false
    return true
  }
)
