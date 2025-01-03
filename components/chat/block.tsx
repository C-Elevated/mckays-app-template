"use client"

import type { Attachment, ChatRequestOptions, Message } from "ai"
import { AnimatePresence, motion } from "framer-motion"
import { useCallback, useEffect } from "react"
import { toast } from "sonner"

import type { Vote } from "@/db/schema"
import { useBlock } from "@/hooks/use-block"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CrossIcon } from "./icons"
import { Editor } from "./editor"
import { CodeEditor } from "./code-editor"

interface BlockProps {
  chatId: string
  input: string
  setInput: (input: string) => void
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    options?: ChatRequestOptions | undefined
  ) => void
  isLoading: boolean
  stop: () => void
  attachments: Array<Attachment>
  setAttachments: (attachments: Array<Attachment>) => void
  append: (message: Message) => Promise<void>
  messages: Array<Message>
  setMessages: (messages: Array<Message>) => void
  reload: () => Promise<string | null | undefined>
  votes: Array<Vote> | undefined
  isReadonly: boolean
}

export function Block({
  chatId,
  input,
  setInput,
  handleSubmit,
  isLoading,
  stop,
  attachments,
  setAttachments,
  append,
  messages,
  setMessages,
  reload,
  votes,
  isReadonly
}: BlockProps) {
  const block = useBlock()

  const handleClose = useCallback(() => {
    block.setBlock(block => ({ ...block, isVisible: false }))
  }, [block])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleClose])

  if (!block.isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-background relative flex h-[80vh] w-[80vw] flex-col overflow-hidden rounded-xl border shadow-lg"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
        >
          <div className="flex flex-row items-center justify-between border-b p-4">
            <div className="font-medium">{block.title}</div>
            <Button
              variant="ghost"
              className="h-auto rounded-full p-2"
              onClick={handleClose}
            >
              <CrossIcon />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {block.kind === "text" ? (
              <Editor
                content={block.content}
                isCurrentVersion={true}
                currentVersionIndex={0}
                status={block.status}
                saveContent={() => {}}
                suggestions={[]}
              />
            ) : block.kind === "code" ? (
              <CodeEditor
                content={block.content}
                isCurrentVersion={true}
                currentVersionIndex={0}
                status={block.status}
                saveContent={() => {}}
                suggestions={[]}
              />
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
