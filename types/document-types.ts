import type { Document } from "@/db/schema"

export type DocumentToolType = "update" | "request-suggestions" | "create"

export interface DocumentToolArgs {
  update: {
    diff: string
  }
  "request-suggestions": {
    query: string
  }
  create: {
    title: string
    kind?: "text" | "code"
  }
}

export interface DocumentToolResult {
  update: {
    diff: string
  }
  "request-suggestions": {
    suggestions: string[]
  }
  create: {
    id: string
    title: string
    kind: Document["kind"]
  }
}

export type DocumentToolCallProps<
  T extends DocumentToolType = DocumentToolType
> = {
  type: T
  args: DocumentToolArgs[T]
  isReadonly: boolean
}

export type DocumentToolResultProps<
  T extends DocumentToolType = DocumentToolType
> = {
  type: T
  result: DocumentToolResult[T]
  isReadonly: boolean
}

export interface DocumentPreviewProps {
  isReadonly: boolean
  result?: {
    id: string
    title: string
    kind: Document["kind"]
  }
  args?: {
    title: string
    kind?: "text" | "code"
  }
}
