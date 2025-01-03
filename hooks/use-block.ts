import { create } from "zustand"
import type { UIBlock } from "@/types/block"

interface BlockStore {
  documentId: string
  kind: "text" | "code"
  content: string
  title: string
  isVisible: boolean
  status: "idle" | "streaming"
  boundingBox: {
    top: number
    left: number
    width: number
    height: number
  } | null
  setBlock: (block: UIBlock | ((block: UIBlock) => UIBlock)) => void
}

export const useBlock = create<BlockStore>((set) => ({
  documentId: "",
  kind: "text",
  content: "",
  title: "",
  isVisible: false,
  status: "idle",
  boundingBox: null,
  setBlock: (block) =>
    set((state) => ({
      ...state,
      ...(typeof block === "function" ? block(state) : block)
    }))
}))

export const useBlockSelector = useBlock 