import type { Message as AIMessage } from "ai"

export interface Message extends AIMessage {
  context?: string
}

export type { CreateMessage, ChatRequestOptions } from "ai"
