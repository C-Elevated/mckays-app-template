"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { processDocument } from "@/lib/rag/processing/process-document"
import { createClient } from "@/components/utilities/supabase/client"
import { useState, useEffect } from "react"

export default function DocumentUploader() {
  const [document, setDocument] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      setUserId(user?.id || null)
    }
    getUser()
  }, [supabase.auth])

  const handleUpload = async () => {
    if (!userId) {
      console.error("No user ID found")
      return
    }

    try {
      await processDocument(document, userId)
      setDocument("")
    } catch (error) {
      console.error("Error processing document:", error)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <h2 className="mb-4 text-2xl font-bold">Document Uploader</h2>
      <Textarea
        className="mb-4 grow"
        placeholder="Enter your document text here..."
        value={document}
        onChange={e => setDocument(e.target.value)}
      />
      <Button onClick={handleUpload}>Upload Document</Button>
    </div>
  )
}
