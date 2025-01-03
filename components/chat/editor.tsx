"use client"

import { useEffect, useRef } from "react"
import { EditorView, basicSetup } from "codemirror"
import { EditorState } from "@codemirror/state"
import { markdown } from "@codemirror/lang-markdown"
import { oneDark } from "@codemirror/theme-one-dark"

interface EditorProps {
  content: string
  isCurrentVersion: boolean
  currentVersionIndex: number
  status: "idle" | "streaming"
  saveContent: (content: string) => void
  suggestions: Array<string>
}

export function Editor({
  content,
  isCurrentVersion,
  currentVersionIndex,
  status,
  saveContent,
  suggestions
}: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView>()

  useEffect(() => {
    if (!editorRef.current) return

    const state = EditorState.create({
      doc: content,
      extensions: [
        basicSetup,
        markdown(),
        oneDark,
        EditorState.readOnly.of(!isCurrentVersion || status === "streaming"),
        EditorView.updateListener.of(update => {
          if (update.docChanged && isCurrentVersion) {
            saveContent(update.state.doc.toString())
          }
        })
      ]
    })

    const view = new EditorView({
      state,
      parent: editorRef.current
    })

    viewRef.current = view

    return () => {
      view.destroy()
    }
  }, [content, isCurrentVersion, currentVersionIndex, status, saveContent])

  return <div ref={editorRef} className="size-full" />
}
