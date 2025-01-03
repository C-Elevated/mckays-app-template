export type BlockKind = "text" | "code"

export interface BoundingBox {
  top: number
  left: number
  width: number
  height: number
}

export interface UIBlock {
  documentId: string
  kind: BlockKind
  content: string
  title: string
  isVisible: boolean
  status: "idle" | "streaming"
  boundingBox: BoundingBox | null
}

export interface ConsoleOutput {
  id: string
  content: string | null
  status: "in_progress" | "completed" | "failed"
}
