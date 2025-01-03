"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"

interface UseClipboardOptions {
  successMessage?: string
  errorMessage?: string
  timeout?: number
}

export function useClipboard(options: UseClipboardOptions = {}) {
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()
  const {
    successMessage = "Copied to clipboard!",
    errorMessage = "Failed to copy to clipboard",
    timeout = 2000
  } = options

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setIsCopied(true)
        toast({
          title: "Success",
          description: successMessage
        })
        setTimeout(() => setIsCopied(false), timeout)
        return true
      } catch (error) {
        console.error("Failed to copy:", error)
        toast({
          title: "Error",
          description: errorMessage
        })
        return false
      }
    },
    [successMessage, errorMessage, timeout, toast]
  )

  return { isCopied, copyToClipboard }
}
