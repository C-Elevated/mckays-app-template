"use client"

import { useEffect, useRef } from "react"
import { EditorView, basicSetup } from "codemirror"
import { EditorState } from "@codemirror/state"
import { python } from "@codemirror/lang-python"
import { oneDark } from "@codemirror/theme-one-dark"
import { indentUnit } from "@codemirror/language"
import { keymap } from "@codemirror/view"
import { indentWithTab } from "@codemirror/commands"

interface CodeEditorProps {
  content: string
  isCurrentVersion: boolean
  currentVersionIndex: number
  status: "idle" | "streaming"
  saveContent: (content: string) => void
  suggestions: Array<string>
}

export function CodeEditor({
  content,
  isCurrentVersion,
  currentVersionIndex,
  status,
  saveContent,
  suggestions
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView>()

  useEffect(() => {
    if (!editorRef.current) return

    const state = EditorState.create({
      doc: content,
      extensions: [
        basicSetup,
        python(),
        oneDark,
        indentUnit.of("    "), // 4 spaces for Python
        keymap.of([indentWithTab]),
        EditorState.readOnly.of(!isCurrentVersion || status === "streaming"),
        EditorView.updateListener.of(update => {
          if (update.docChanged && isCurrentVersion) {
            saveContent(update.state.doc.toString())
          }
        }),
        EditorView.theme({
          "&": { height: "100%" },
          ".cm-scroller": { overflow: "auto" },
          ".cm-content": { minHeight: "100%", padding: "10px 0" }
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
