"use client"

import {
  Dispatch,
  SetStateAction,
  memo,
  startTransition,
  useCallback,
  useState
} from "react"
import { useToast } from "@/components/ui/use-toast"
import { useCopyToClipboard } from "usehooks-ts"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { ConsoleOutput, UIBlock } from "@/types/block"
import { ClockRewind, CopyIcon, PlayIcon, RedoIcon, UndoIcon } from "./icons"

interface BlockActionsProps {
  block: UIBlock
  handleVersionChange: (type: "next" | "prev" | "toggle" | "latest") => void
  currentVersionIndex: number
  isCurrentVersion: boolean
  mode: "read-only" | "edit" | "diff"
  setConsoleOutputs: Dispatch<SetStateAction<Array<ConsoleOutput>>>
}

function RunCodeButton({
  block,
  setConsoleOutputs
}: {
  block: UIBlock
  setConsoleOutputs: Dispatch<SetStateAction<Array<ConsoleOutput>>>
}) {
  const [pyodide, setPyodide] = useState<any>(null)
  const isPython = true
  const codeContent = block.content

  const updateConsoleOutput = useCallback(
    (runId: string, content: string | null, status: "completed" | "failed") => {
      setConsoleOutputs(consoleOutputs => {
        const index = consoleOutputs.findIndex(output => output.id === runId)
        if (index === -1) return consoleOutputs

        const updatedOutputs = [...consoleOutputs]
        updatedOutputs[index] = {
          id: runId,
          content,
          status
        }

        return updatedOutputs
      })
    },
    [setConsoleOutputs]
  )

  const loadAndRunPython = useCallback(async () => {
    const runId = crypto.randomUUID()

    setConsoleOutputs(consoleOutputs => [
      ...consoleOutputs,
      {
        id: runId,
        content: null,
        status: "in_progress"
      }
    ])

    let currentPyodideInstance = pyodide

    if (isPython) {
      if (!currentPyodideInstance) {
        // @ts-expect-error - pyodide is not defined
        const newPyodideInstance = await loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/"
        })

        setPyodide(newPyodideInstance)
        currentPyodideInstance = newPyodideInstance
      }

      try {
        await currentPyodideInstance.runPythonAsync(`
          import sys
          import io
          sys.stdout = io.StringIO()
        `)

        await currentPyodideInstance.runPythonAsync(codeContent)

        const output: string = await currentPyodideInstance.runPythonAsync(
          `sys.stdout.getvalue()`
        )

        updateConsoleOutput(runId, output, "completed")
      } catch (error: any) {
        updateConsoleOutput(runId, error.message, "failed")
      }
    }
  }, [pyodide, codeContent, isPython, setConsoleOutputs, updateConsoleOutput])

  return (
    <Button
      variant="outline"
      className="hover:bg-muted h-fit px-2 py-1.5"
      onClick={() => {
        startTransition(() => {
          loadAndRunPython()
        })
      }}
      disabled={block.status === "streaming"}
    >
      <PlayIcon size={18} /> Run
    </Button>
  )
}

function PureBlockActions({
  block,
  handleVersionChange,
  currentVersionIndex,
  isCurrentVersion,
  mode,
  setConsoleOutputs
}: BlockActionsProps) {
  const [_, copyToClipboard] = useCopyToClipboard()
  const { toast } = useToast()

  return (
    <div className="flex flex-row gap-1">
      {block.kind === "code" && (
        <RunCodeButton block={block} setConsoleOutputs={setConsoleOutputs} />
      )}

      {block.kind === "text" && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className={cn("hover:bg-muted !pointer-events-auto h-fit p-2", {
                "bg-muted": mode === "diff"
              })}
              onClick={() => {
                handleVersionChange("toggle")
              }}
              disabled={
                block.status === "streaming" || currentVersionIndex === 0
              }
            >
              <ClockRewind size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>View changes</TooltipContent>
        </Tooltip>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="hover:bg-muted !pointer-events-auto h-fit p-2"
            onClick={() => {
              handleVersionChange("prev")
            }}
            disabled={currentVersionIndex === 0 || block.status === "streaming"}
          >
            <UndoIcon size={18} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>View Previous version</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="hover:bg-muted !pointer-events-auto h-fit p-2"
            onClick={() => {
              handleVersionChange("next")
            }}
            disabled={isCurrentVersion || block.status === "streaming"}
          >
            <RedoIcon size={18} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>View Next version</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="hover:bg-muted h-fit p-2"
            onClick={() => {
              copyToClipboard(block.content)
              toast({
                title: "Success",
                description: "Block copied to clipboard!"
              })
            }}
            disabled={block.status === "streaming"}
          >
            <CopyIcon size={18} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copy to clipboard</TooltipContent>
      </Tooltip>
    </div>
  )
}

export const BlockActions = memo(PureBlockActions, (prevProps, nextProps) => {
  if (prevProps.block.status !== nextProps.block.status) return false
  if (prevProps.currentVersionIndex !== nextProps.currentVersionIndex)
    return false
  if (prevProps.isCurrentVersion !== nextProps.isCurrentVersion) return false

  return true
})
