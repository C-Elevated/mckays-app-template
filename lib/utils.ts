/*
<ai_context>
Contains the utility functions for the app.
</ai_context>
*/

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Message } from "ai"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeUIMessages(messages: Array<Message>): Array<Message> {
  return messages.map(message => {
    if (message.role === "assistant" && message.content === null) {
      return {
        ...message,
        content: ""
      }
    }
    return message
  })
}

export async function fetcher<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, init)
  if (!res.ok) throw new Error("Failed to fetch data")
  return res.json()
}

export function getMessageIdFromAnnotations(annotations: any[] = []) {
  const messageIdAnnotation = annotations.find(
    annotation => annotation.type === "message_id"
  )
  return messageIdAnnotation?.message_id
}
