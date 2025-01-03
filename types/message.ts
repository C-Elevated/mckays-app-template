export interface Message {
  id: string
  content: string
  role: "user" | "assistant" | "system"
  createdAt?: Date
  updatedAt?: Date
}

export interface ChatRequestOptions {
  headers?: Record<string, string>
  body?: any
  signal?: AbortSignal
}
