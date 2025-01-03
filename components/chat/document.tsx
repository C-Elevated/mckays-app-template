"use client"

import { memo } from "react"
import { useToast } from "@/components/ui/use-toast"
import type {
  DocumentToolType,
  DocumentToolCallProps,
  DocumentToolResultProps,
  DocumentToolArgs,
  DocumentToolResult as DocumentToolResultType
} from "@/types/document-types"

import { Button } from "@/components/ui/button"
import { CodeBlock } from "./code-block"

export function DocumentToolCall<T extends DocumentToolType>({
  type,
  args,
  isReadonly
}: DocumentToolCallProps<T>) {
  if (type === "update") {
    const updateArgs = args as DocumentToolArgs["update"]
    return (
      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground text-sm">
          Updating document...
        </div>
        <CodeBlock node={{}} inline={false} className="language-diff">
          {updateArgs.diff}
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

  if (type === "create") {
    const createArgs = args as DocumentToolArgs["create"]
    return (
      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground text-sm">
          Creating document: {createArgs.title}
        </div>
      </div>
    )
  }

  return null
}

function PureDocumentToolResult<T extends DocumentToolType>({
  type,
  result,
  isReadonly
}: DocumentToolResultProps<T>) {
  const { toast } = useToast()

  if (type === "update") {
    const updateResult = result as DocumentToolResultType["update"]
    return (
      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground text-sm">
          Document updated successfully!
        </div>
        <CodeBlock node={{}} inline={false} className="language-diff">
          {updateResult.diff}
        </CodeBlock>
      </div>
    )
  }

  if (type === "request-suggestions") {
    const suggestionsResult =
      result as DocumentToolResultType["request-suggestions"]
    return (
      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground text-sm">
          Here are some suggestions:
        </div>
        <div className="flex flex-row flex-wrap gap-2">
          {suggestionsResult.suggestions.map(
            (suggestion: string, index: number) => (
              <Button
                key={index}
                variant="outline"
                className="text-sm"
                disabled={isReadonly}
                onClick={() => {
                  navigator.clipboard.writeText(suggestion)
                  toast({
                    title: "Success",
                    description: "Copied to clipboard!"
                  })
                }}
              >
                {suggestion}
              </Button>
            )
          )}
        </div>
      </div>
    )
  }

  if (type === "create") {
    const createResult = result as DocumentToolResultType["create"]
    return (
      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground text-sm">
          Document created: {createResult.title}
        </div>
      </div>
    )
  }

  return null
}

export const DocumentToolResultComponent = memo(PureDocumentToolResult)
