import type { Attachment, Message as AIMessage } from "ai"

export interface Message extends AIMessage {
  chatId: string
}

export type { Attachment }
export type { CreateMessage, ChatRequestOptions } from "ai"
