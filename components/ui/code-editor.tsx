"use client"

import { EditorView } from "@codemirror/view"
import { EditorState, Transaction } from "@codemirror/state"
import { python } from "@codemirror/lang-python"
import { oneDark } from "@codemirror/theme-one-dark"
import { basicSetup } from "codemirror"
import { memo, useEffect, useRef } from "react"

interface Suggestion {
  id: string
  content: string
  type: "addition" | "deletion" | "modification"
  lineNumber: number
  createdAt: string
}

interface EditorProps {
  content: string
  saveContent: (updatedContent: string, debounce: boolean) => void
  status: "streaming" | "idle"
  isCurrentVersion: boolean
  currentVersionIndex: number
  suggestions: Array<Suggestion>
}

function PureCodeEditor({
  content,
  saveContent,
  status,
  suggestions,
  isCurrentVersion,
  currentVersionIndex
}: EditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<EditorView | null>(null)

  // Initialize editor
  useEffect(() => {
    if (containerRef.current && !editorRef.current) {
      const startState = EditorState.create({
        doc: content,
        extensions: [basicSetup, python(), oneDark]
      })

      editorRef.current = new EditorView({
        state: startState,
        parent: containerRef.current
      })
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy()
        editorRef.current = null
      }
    }
    // NOTE: we only want to run this effect once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Set up update listener
  useEffect(() => {
    if (editorRef.current) {
      const updateListener = EditorView.updateListener.of(update => {
        if (update.docChanged) {
          const transaction = update.transactions.find(
            tr => !tr.annotation(Transaction.remote)
          )

          if (transaction) {
            const newContent = update.state.doc.toString()
            saveContent(newContent, true)
          }
        }
      })

      const newState = EditorState.create({
        doc: editorRef.current.state.doc,
        extensions: [basicSetup, python(), oneDark, updateListener]
      })

      editorRef.current.setState(newState)
    }
  }, [saveContent])

  // Update content when streaming or content changes
  useEffect(() => {
    if (editorRef.current && content) {
      const currentContent = editorRef.current.state.doc.toString()

      if (status === "streaming" || currentContent !== content) {
        const transaction = editorRef.current.state.update({
          changes: {
            from: 0,
            to: currentContent.length,
            insert: content
          },
          annotations: [Transaction.remote.of(true)]
        })

        editorRef.current.dispatch(transaction)
      }
    }
  }, [content, status])

  return (
    <div
      className="not-prose relative w-full pb-[calc(80dvh)] text-sm"
      ref={containerRef}
    />
  )
}

function areEqual(prevProps: EditorProps, nextProps: EditorProps) {
  if (prevProps.suggestions !== nextProps.suggestions) return false
  if (prevProps.currentVersionIndex !== nextProps.currentVersionIndex)
    return false
  if (prevProps.isCurrentVersion !== nextProps.isCurrentVersion) return false
  if (prevProps.status === "streaming" && nextProps.status === "streaming")
    return false
  if (prevProps.content !== nextProps.content) return false

  return true
}

export const CodeEditor = memo(PureCodeEditor, areEqual)
