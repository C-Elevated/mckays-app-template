"use client"

import { useFormStatus } from "react-dom"

import { Button } from "@/components/ui/button"
import { LoaderIcon } from "@/components/chat/icons"

interface SubmitButtonProps {
  children: React.ReactNode
  isSuccessful: boolean
}

export function SubmitButton({ children, isSuccessful }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button
      type={pending ? "button" : "submit"}
      aria-disabled={pending || isSuccessful}
      disabled={pending || isSuccessful}
      className="relative"
    >
      {children}

      {(pending || isSuccessful) && (
        <span className="absolute right-4 animate-spin">
          <LoaderIcon />
        </span>
      )}

      <output aria-live="polite" className="sr-only">
        {pending || isSuccessful ? "Loading" : "Submit form"}
      </output>
    </Button>
  )
}
