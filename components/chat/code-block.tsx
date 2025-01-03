"use client"

import { useCallback, useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { CodeIcon, LoaderIcon, PlayIcon, PythonIcon } from "./icons"

interface CodeBlockProps {
  node: any
  inline: boolean
  className: string
  children: any
}

export function CodeBlock({
  node,
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const [output, setOutput] = useState<string | null>(null)
  const [pyodide, setPyodide] = useState<any>(null)
  const match = /language-(\w+)/.exec(className || "")
  const isPython = match && match[1] === "python"
  const codeContent = String(children).replace(/\n$/, "")
  const [tab, setTab] = useState<"code" | "run">("code")

  if (!inline) {
    return (
      <div className="not-prose flex flex-col">
        <div className="flex flex-row items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-800">
          <div className="flex flex-row items-center gap-2">
            {isPython ? <PythonIcon /> : <CodeIcon />}
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              {match ? match[1] : "plaintext"}
            </span>
          </div>
          {isPython && (
            <div className="flex flex-row gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn("size-7", {
                      "bg-zinc-100 dark:bg-zinc-700": tab === "code"
                    })}
                    onClick={() => setTab("code")}
                  >
                    <CodeIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View Code</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn("size-7", {
                      "bg-zinc-100 dark:bg-zinc-700": tab === "run"
                    })}
                    onClick={() => setTab("run")}
                  >
                    <PlayIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Run Code</TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>

        {tab === "code" && (
          <pre
            {...props}
            className="w-full overflow-x-auto border border-t-0 border-zinc-200 p-4 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          >
            <code className="whitespace-pre-wrap break-words">{children}</code>
          </pre>
        )}

        {tab === "run" && output && (
          <div className="w-full overflow-x-auto border border-t-0 border-zinc-200 bg-zinc-800 p-4 text-sm text-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
            <code>{output}</code>
          </div>
        )}
      </div>
    )
  }

  return (
    <code
      className={cn(
        className,
        "rounded-md bg-zinc-100 px-1 py-0.5 text-sm dark:bg-zinc-800"
      )}
      {...props}
    >
      {children}
    </code>
  )
}
