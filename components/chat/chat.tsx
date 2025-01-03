"use client"

import type { Attachment, Message } from "ai"
import { useChat } from "ai/react"
import { useState } from "react"
import useSWR, { useSWRConfig } from "swr"

import { ChatHeader } from "@/components/chat-header"
import type { Vote } from "@/db/schema"
import { fetcher } from "@/lib/utils"
import { useBlockSelector } from "@/hooks/use-block"
import { runRagPipeline } from "@/lib/rag/retrieval/run-rag-pipeline"
import { Block } from "./block"
import { MultimodalInput } from "./multimodal-input"
import { Messages } from "./messages"
import type { VisibilityType } from "./visibility-selector"

interface ChatProps {
  id: string
  initialMessages: Array<Message>
  selectedModelId: string
  selectedVisibilityType: VisibilityType
  isReadonly: boolean
}

export function Chat({
  id,
  initialMessages,
  selectedModelId,
  selectedVisibilityType,
  isReadonly
}: ChatProps) {
  const { mutate } = useSWRConfig()
  const [currentDocs, setCurrentDocs] = useState<
    Array<{ content: string; source: string }>
  >([])

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
    reload
  } = useChat({
    id,
    body: {
      id,
      modelId: selectedModelId,
      context:
        currentDocs.length > 0
          ? `Based on the following documents:\n\n${currentDocs.map(doc => doc.content).join("\n\n")}\n\nPlease answer: `
          : undefined
    },
    initialMessages,
    experimental_throttle: 100,
    onFinish: () => {
      mutate("/api/history")
    },
    onSubmit: async input => {
      try {
        // Always run RAG pipeline first
        const relevantDocs = await runRagPipeline(input)

        if (relevantDocs.length > 0) {
          // If we have relevant docs, use them
          setCurrentDocs(
            relevantDocs.map(doc => ({
              content: doc.content,
              source: doc.source || "Unknown source"
            }))
          )
        } else {
          // If no relevant docs found, clear context
          setCurrentDocs([])
        }
      } catch (error) {
        console.error("Error running RAG pipeline:", error)
        setCurrentDocs([])
      }
    }
  })

  const { data: votes } = useSWR<Array<Vote>>(`/api/vote?chatId=${id}`, fetcher)

  const [attachments, setAttachments] = useState<Array<Attachment>>([])
  const isBlockVisible = useBlockSelector(state => state.isVisible)

  return (
    <>
      <div className="bg-background flex min-h-dvh min-w-0 flex-col">
        <ChatHeader
          chatId={id}
          selectedModelId={selectedModelId}
          selectedVisibilityType={selectedVisibilityType}
          isReadonly={isReadonly}
        />

        <Messages
          chatId={id}
          isLoading={isLoading}
          votes={votes}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          isBlockVisible={isBlockVisible}
          currentDocs={currentDocs}
        />

        <form className="bg-background mx-auto flex w-full gap-2 px-4 pb-4 md:max-w-3xl md:pb-6">
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              setMessages={setMessages}
              append={append}
            />
          )}
        </form>
      </div>

      <Block
        chatId={id}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        stop={stop}
        attachments={attachments}
        setAttachments={setAttachments}
        append={append}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        votes={votes}
        isReadonly={isReadonly}
      />
    </>
  )
}
