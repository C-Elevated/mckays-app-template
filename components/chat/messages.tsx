"use client"

import type { Message } from "ai"
import { useEffect, useRef, useState } from "react"
import { useInView } from "react-intersection-observer"

import type { Vote } from "@/db/schema"
import { cn } from "@/lib/utils"
import { PreviewMessage, ThinkingMessage } from "./preview-message"
import { useScroll } from "@/lib/hooks/use-scroll"

interface MessagesProps {
  chatId: string
  isLoading: boolean
  votes: Array<Vote> | undefined
  messages: Array<Message>
  setMessages: (messages: Array<Message>) => void
  reload: () => Promise<string | null | undefined>
  isReadonly: boolean
  isBlockVisible: boolean
  currentDocs?: Array<{ content: string; source: string }>
}

export function Messages({
  chatId,
  isLoading,
  votes,
  messages,
  setMessages,
  reload,
  isReadonly,
  isBlockVisible,
  currentDocs
}: MessagesProps) {
  const [expandedSources, setExpandedSources] = useState<number | null>(null)
  const { elementRef, inViewRef } = useScroll<HTMLDivElement>()

  return (
    <div className="flex-1 overflow-y-auto">
      <div
        className={cn("mx-auto flex max-w-3xl flex-col gap-4 p-4", {
          "opacity-50": isBlockVisible
        })}
      >
        {messages.map((message, index) => (
          <div key={index} className="flex flex-col gap-2">
            <PreviewMessage
              chatId={chatId}
              message={message}
              vote={votes?.find(vote => vote.messageId === message.id)}
              isLoading={isLoading}
              setMessages={setMessages}
              reload={reload}
              isReadonly={isReadonly}
            />
            {message.role === "user" &&
              currentDocs &&
              currentDocs.length > 0 &&
              index === messages.length - 2 && (
                <div className="bg-muted/50 rounded-lg border p-4">
                  <button
                    onClick={() =>
                      setExpandedSources(
                        expandedSources === index ? null : index
                      )
                    }
                    className="text-muted-foreground hover:text-foreground flex w-full items-center justify-between text-sm"
                  >
                    <span className="font-medium">
                      {expandedSources === index ? "Hide" : "Show"}{" "}
                      {currentDocs.length} relevant sources
                    </span>
                    <svg
                      className={cn("size-4 transition-transform", {
                        "rotate-180": expandedSources === index
                      })}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {expandedSources === index && (
                    <div className="mt-4 space-y-4">
                      {currentDocs.map((doc, i) => (
                        <div
                          key={i}
                          className="bg-background rounded-lg border p-4"
                        >
                          <div className="text-muted-foreground mb-2 text-xs font-medium">
                            Source: {doc.source}
                          </div>
                          <div className="text-sm">{doc.content}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
          </div>
        ))}

        {isLoading && <ThinkingMessage />}

        <div ref={elementRef} />
        <div ref={inViewRef} />
      </div>
    </div>
  )
}
