"use client"

import { memo } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

interface CodeBlockProps {
  inline?: boolean
  className?: string
  children: string
}

function NonMemoizedCodeBlock({ inline, className, children }: CodeBlockProps) {
  const language = className?.replace(/language-/, "") || "typescript"
  const match = /language-(\w+)/.exec(className || "")

  return !inline && match ? (
    <div className="relative rounded-lg">
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: "1rem",
          backgroundColor: "hsl(var(--background))",
          borderRadius: "0.5rem"
        }}
      >
        {children.trim()}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className="bg-muted rounded px-1 py-0.5">{children}</code>
  )
}

export const CodeBlock = memo(NonMemoizedCodeBlock)
