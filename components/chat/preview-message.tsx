"use client"

import type { ChatRequestOptions, Message } from "ai"
import { AnimatePresence, motion } from "framer-motion"
import { memo, useState } from "react"
import equal from "fast-deep-equal"

import { cn } from "@/lib/utils"
import type { Vote } from "@/db/schema"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { DocumentToolCall, DocumentToolResult } from "./document"
import { PencilEditIcon, SparklesIcon } from "./icons"
import { Markdown } from "./markdown"
import { MessageActions } from "./message-actions"
import { PreviewAttachment } from "./preview-attachment"
import { Weather } from "./weather"
import { MessageEditor } from "./message-editor"
import { DocumentPreview } from "./document-preview"

interface PreviewMessageProps {
  chatId: string
  message: Message
  vote: Vote | undefined
  isLoading: boolean
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[])
  ) => void
  reload: (
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>
  isReadonly: boolean
}

function PurePreviewMessage({
  chatId,
  message,
  vote,
  isLoading,
  setMessages,
  reload,
  isReadonly
}: PreviewMessageProps) {
  const [mode, setMode] = useState<"view" | "edit">("view")

  return (
    <AnimatePresence>
      <motion.div
        className="group/message mx-auto w-full max-w-3xl px-4"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn(
            "flex w-full gap-4 group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl",
            {
              "w-full": mode === "edit",
              "group-data-[role=user]/message:w-fit": mode !== "edit"
            }
          )}
        >
          {message.role === "assistant" && (
            <div className="bg-background ring-border flex size-8 shrink-0 items-center justify-center rounded-full ring-1">
              <div className="translate-y-px">
                <SparklesIcon size={14} />
              </div>
            </div>
          )}

          <div className="flex w-full flex-col gap-2">
            {message.experimental_attachments && (
              <div className="flex flex-row justify-end gap-2">
                {message.experimental_attachments.map(attachment => (
                  <PreviewAttachment
                    key={attachment.url}
                    attachment={attachment}
                  />
                ))}
              </div>
            )}

            {message.content && mode === "view" && (
              <div className="flex flex-row items-start gap-2">
                {message.role === "user" && !isReadonly && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-muted-foreground h-fit rounded-full px-2 opacity-0 group-hover/message:opacity-100"
                        onClick={() => {
                          setMode("edit")
                        }}
                      >
                        <PencilEditIcon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit message</TooltipContent>
                  </Tooltip>
                )}

                <div
                  className={cn("flex flex-col gap-4", {
                    "rounded-xl bg-primary px-3 py-2 text-primary-foreground":
                      message.role === "user"
                  })}
                >
                  <Markdown>{message.content as string}</Markdown>
                </div>
              </div>
            )}

            {message.content && mode === "edit" && (
              <div className="flex flex-row items-start gap-2">
                <div className="size-8" />
                <MessageEditor
                  key={message.id}
                  message={message}
                  setMode={setMode}
                  setMessages={setMessages}
                  reload={reload}
                />
              </div>
            )}

            {message.toolInvocations && message.toolInvocations.length > 0 && (
              <div className="flex flex-col gap-4">
                {message.toolInvocations.map(toolInvocation => {
                  const { toolName, toolCallId, state, args } = toolInvocation

                  if (state === "result") {
                    const { result } = toolInvocation

                    return (
                      <div key={toolCallId}>
                        {toolName === "getWeather" ? (
                          <Weather weatherAtLocation={result} />
                        ) : toolName === "createDocument" ? (
                          <DocumentPreview
                            isReadonly={isReadonly}
                            result={result}
                          />
                        ) : toolName === "updateDocument" ? (
                          <DocumentToolResult
                            type="update"
                            result={result}
                            isReadonly={isReadonly}
                          />
                        ) : toolName === "requestSuggestions" ? (
                          <DocumentToolResult
                            type="request-suggestions"
                            result={result}
                            isReadonly={isReadonly}
                          />
                        ) : (
                          <pre>{JSON.stringify(result, null, 2)}</pre>
                        )}
                      </div>
                    )
                  }

                  return (
                    <div
                      key={toolCallId}
                      className={cn({
                        skeleton: ["getWeather"].includes(toolName)
                      })}
                    >
                      {toolName === "getWeather" ? (
                        <Weather />
                      ) : toolName === "createDocument" ? (
                        <DocumentPreview isReadonly={isReadonly} args={args} />
                      ) : toolName === "updateDocument" ? (
                        <DocumentToolCall
                          type="update"
                          args={args}
                          isReadonly={isReadonly}
                        />
                      ) : toolName === "requestSuggestions" ? (
                        <DocumentToolCall
                          type="request-suggestions"
                          args={args}
                          isReadonly={isReadonly}
                        />
                      ) : null}
                    </div>
                  )
                })}
              </div>
            )}

            {!isReadonly && (
              <MessageActions
                key={`action-${message.id}`}
                chatId={chatId}
                message={message}
                vote={vote}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false
    if (prevProps.message.content !== nextProps.message.content) return false
    if (
      !equal(
        prevProps.message.toolInvocations,
        nextProps.message.toolInvocations
      )
    )
      return false
    if (!equal(prevProps.vote, nextProps.vote)) return false
    return true
  }
)

export function ThinkingMessage() {
  const role = "assistant"

  return (
    <motion.div
      className="group/message mx-auto w-full max-w-3xl px-4"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cn(
          "flex w-full gap-4 rounded-xl group-data-[role=user]/message:ml-auto group-data-[role=user]/message:w-fit group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:px-3 group-data-[role=user]/message:py-2",
          {
            "group-data-[role=user]/message:bg-muted": true
          }
        )}
      >
        <div className="ring-border flex size-8 shrink-0 items-center justify-center rounded-full ring-1">
          <SparklesIcon size={14} />
        </div>

        <div className="flex w-full flex-col gap-2">
          <div className="text-muted-foreground flex flex-col gap-4">
            Thinking...
          </div>
        </div>
      </div>
    </motion.div>
  )
}
