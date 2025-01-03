"use client"

import type { Attachment, ChatRequestOptions, CreateMessage, Message } from "ai"
import cx from "classnames"
import type React from "react"
import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
  type ChangeEvent,
  memo
} from "react"
import { useToast } from "@/components/ui/use-toast"
import { useLocalStorage, useWindowSize } from "usehooks-ts"
import equal from "fast-deep-equal"

import { sanitizeUIMessages } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowUpIcon, PaperclipIcon, StopIcon } from "./icons"
import { PreviewAttachment } from "./preview-attachment"
import { SuggestedActions } from "./suggested-actions"

interface MultimodalInputProps {
  chatId: string
  input: string
  setInput: (value: string) => void
  isLoading: boolean
  stop: () => void
  attachments: Array<Attachment>
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>
  messages: Array<Message>
  setMessages: Dispatch<SetStateAction<Array<Message>>>
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>
  handleSubmit: (
    event?: {
      preventDefault?: () => void
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void
  className?: string
}

function PureMultimodalInput({
  chatId,
  input,
  setInput,
  isLoading,
  stop,
  attachments,
  setAttachments,
  messages,
  setMessages,
  append,
  handleSubmit,
  className
}: MultimodalInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { width } = useWindowSize()
  const { toast } = useToast()

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight()
    }
  }, [])

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`
    }
  }

  const [localStorageInput, setLocalStorageInput] = useLocalStorage("input", "")

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value
      const finalValue = domValue || localStorageInput || ""
      setInput(finalValue)
      adjustHeight()
    }
  }, [])

  useEffect(() => {
    setLocalStorageInput(input)
  }, [input, setLocalStorageInput])

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value)
    adjustHeight()
  }

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([])

  const submitForm = useCallback(() => {
    window.history.replaceState({}, "", `/chat/${chatId}`)

    handleSubmit(undefined, {
      experimental_attachments: attachments
    })

    setAttachments([])
    setLocalStorageInput("")

    if (width && width > 768) {
      textareaRef.current?.focus()
    }
  }, [
    attachments,
    handleSubmit,
    setAttachments,
    setLocalStorageInput,
    width,
    chatId
  ])

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        const { url, pathname, contentType } = data

        return {
          url,
          name: pathname,
          contentType: contentType
        }
      }
      const { error } = await response.json()
      toast({
        title: "Error",
        description: error
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file, please try again!"
      })
    }
  }

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || [])

      setUploadQueue(files.map(file => file.name))

      try {
        const uploadPromises = files.map(file => uploadFile(file))
        const uploadedAttachments = await Promise.all(uploadPromises)
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          attachment => attachment !== undefined
        )

        setAttachments(currentAttachments => [
          ...currentAttachments,
          ...successfullyUploadedAttachments
        ])
      } catch (error) {
        console.error("Error uploading files!", error)
      } finally {
        setUploadQueue([])
      }
    },
    [setAttachments]
  )

  return (
    <div className="relative flex w-full flex-col gap-4">
      {messages.length === 0 &&
        attachments.length === 0 &&
        uploadQueue.length === 0 && (
          <SuggestedActions append={append} chatId={chatId} />
        )}

      <input
        type="file"
        className="pointer-events-none fixed -left-4 -top-4 size-0.5 opacity-0"
        ref={fileInputRef}
        multiple
        onChange={handleFileChange}
        tabIndex={-1}
      />

      {(attachments.length > 0 || uploadQueue.length > 0) && (
        <div className="flex flex-row items-end gap-2 overflow-x-scroll">
          {attachments.map(attachment => (
            <PreviewAttachment key={attachment.url} attachment={attachment} />
          ))}

          {uploadQueue.map(filename => (
            <PreviewAttachment
              key={filename}
              attachment={{
                url: "",
                name: filename,
                contentType: ""
              }}
              isUploading={true}
            />
          ))}
        </div>
      )}

      <Textarea
        ref={textareaRef}
        placeholder="Send a message..."
        value={input}
        onChange={handleInput}
        className={cx(
          "min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-2xl !text-base bg-muted pb-10 dark:border-zinc-700",
          className
        )}
        rows={2}
        autoFocus
        onKeyDown={event => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault()

            if (isLoading) {
              toast({
                title: "Error",
                description: "Please wait for the model to finish its response!"
              })
            } else {
              submitForm()
            }
          }
        }}
      />

      <div className="absolute bottom-0 flex w-fit flex-row justify-start p-2">
        <AttachmentsButton fileInputRef={fileInputRef} isLoading={isLoading} />
      </div>

      <div className="absolute bottom-0 right-0 flex w-fit flex-row justify-end p-2">
        {isLoading ? (
          <StopButton stop={stop} setMessages={setMessages} />
        ) : (
          <SendButton
            input={input}
            submitForm={submitForm}
            uploadQueue={uploadQueue}
          />
        )}
      </div>
    </div>
  )
}

export const MultimodalInput = memo(
  PureMultimodalInput,
  (prevProps, nextProps) => {
    if (prevProps.input !== nextProps.input) return false
    if (prevProps.isLoading !== nextProps.isLoading) return false
    if (!equal(prevProps.attachments, nextProps.attachments)) return false
    return true
  }
)

interface AttachmentsButtonProps {
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>
  isLoading: boolean
}

function PureAttachmentsButton({
  fileInputRef,
  isLoading
}: AttachmentsButtonProps) {
  return (
    <Button
      className="h-fit rounded-md rounded-bl-lg p-[7px] hover:bg-zinc-200 dark:border-zinc-700 hover:dark:bg-zinc-900"
      onClick={event => {
        event.preventDefault()
        fileInputRef.current?.click()
      }}
      disabled={isLoading}
      variant="ghost"
    >
      <PaperclipIcon size={14} />
    </Button>
  )
}

const AttachmentsButton = memo(PureAttachmentsButton)

interface StopButtonProps {
  stop: () => void
  setMessages: Dispatch<SetStateAction<Array<Message>>>
}

function PureStopButton({ stop, setMessages }: StopButtonProps) {
  return (
    <Button
      className="h-fit rounded-full border p-1.5 dark:border-zinc-600"
      onClick={event => {
        event.preventDefault()
        stop()
        setMessages(messages => sanitizeUIMessages(messages))
      }}
    >
      <StopIcon size={14} />
    </Button>
  )
}

const StopButton = memo(PureStopButton)

interface SendButtonProps {
  submitForm: () => void
  input: string
  uploadQueue: Array<string>
}

function PureSendButton({ submitForm, input, uploadQueue }: SendButtonProps) {
  return (
    <Button
      className="h-fit rounded-full border p-1.5 dark:border-zinc-600"
      onClick={event => {
        event.preventDefault()
        submitForm()
      }}
      disabled={input.length === 0 || uploadQueue.length > 0}
    >
      <ArrowUpIcon size={14} />
    </Button>
  )
}

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  if (prevProps.uploadQueue.length !== nextProps.uploadQueue.length)
    return false
  if (prevProps.input !== nextProps.input) return false
  return true
})
