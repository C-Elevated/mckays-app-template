"use client"

import { memo } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { CodeBlock } from "./code-block"

interface DocumentToolCallProps {
  type: "update" | "request-suggestions"
  args: any
  isReadonly: boolean
}

export function DocumentToolCall({
  type,
  args,
  isReadonly
}: DocumentToolCallProps) {
  if (type === "update") {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground text-sm">
          Updating document...
        </div>
        <CodeBlock node={{}} inline={false} className="language-diff">
          {args.diff}
        </CodeBlock>
      </div>
    )
  }

  if (type === "request-suggestions") {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground text-sm">
          Requesting suggestions...
        </div>
      </div>
    )
  }

  return null
}

interface DocumentToolResultProps {
  type: "update" | "request-suggestions"
  result: any
  isReadonly: boolean
}

function PureDocumentToolResult({
  type,
  result,
  isReadonly
}: DocumentToolResultProps) {
  if (type === "update") {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground text-sm">
          Document updated successfully!
        </div>
        <CodeBlock node={{}} inline={false} className="language-diff">
          {result.diff}
        </CodeBlock>
      </div>
    )
  }

  if (type === "request-suggestions") {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground text-sm">
          Here are some suggestions:
        </div>
        <div className="flex flex-row flex-wrap gap-2">
          {result.suggestions.map((suggestion: string, index: number) => (
            <Button
              key={index}
              variant="outline"
              className="text-sm"
              disabled={isReadonly}
              onClick={() => {
                navigator.clipboard.writeText(suggestion)
                toast.success("Copied to clipboard!")
              }}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  return null
}

export const DocumentToolResult = memo(PureDocumentToolResult)
