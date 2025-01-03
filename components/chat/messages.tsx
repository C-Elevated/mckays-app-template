"use client"

import type { Message } from "ai"
import { useEffect, useRef } from "react"
import { useInView } from "react-intersection-observer"

import type { Vote } from "@/db/schema"
import { cn } from "@/lib/utils"
import { PreviewMessage, ThinkingMessage } from "./preview-message"

interface MessagesProps {
  chatId: string
  messages: Array<Message>
  isLoading: boolean
  votes: Array<Vote> | undefined
  setMessages: (messages: Array<Message>) => void
  reload: () => Promise<string | null | undefined>
  isReadonly: boolean
  isBlockVisible: boolean
}

export function Messages({
  chatId,
  messages,
  isLoading,
  votes,
  setMessages,
  reload,
  isReadonly,
  isBlockVisible
}: MessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { ref, entry } = useInView()

  useEffect(() => {
    if (scrollRef.current && entry?.isIntersecting) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }, [messages, entry?.isIntersecting])

  return (
    <div
      className={cn("flex-1 overflow-y-auto", {
        "overflow-hidden": isBlockVisible
      })}
    >
      <div className="flex flex-col gap-6 pb-6 pt-4">
        {messages.map(message => (
          <PreviewMessage
            key={message.id}
            chatId={chatId}
            message={message}
            vote={votes?.find(vote => vote.messageId === message.id)}
            isLoading={isLoading}
            setMessages={setMessages}
            reload={reload}
            isReadonly={isReadonly}
          />
        ))}

        {isLoading && <ThinkingMessage />}

        <div ref={scrollRef} />
        <div ref={ref} />
      </div>
    </div>
  )
}
