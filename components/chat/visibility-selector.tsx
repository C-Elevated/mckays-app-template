"use client"

import { useRouter } from "next/navigation"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { EyeIcon, EyeOffIcon, UsersIcon } from "./icons"

export type VisibilityType = "private" | "unlisted" | "public"

interface VisibilitySelectorProps {
  chatId: string
  selectedVisibilityType: VisibilityType
}

export function VisibilitySelector({
  chatId,
  selectedVisibilityType
}: VisibilitySelectorProps) {
  const router = useRouter()

  return (
    <Select
      value={selectedVisibilityType}
      onValueChange={(value: VisibilityType) => {
        router.push(`/chat/${chatId}?visibility=${value}`)
      }}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          value="private"
          className="flex flex-row items-center gap-2"
        >
          <EyeOffIcon />
          Private
        </SelectItem>
        <SelectItem
          value="unlisted"
          className="flex flex-row items-center gap-2"
        >
          <EyeIcon />
          Unlisted
        </SelectItem>
        <SelectItem value="public" className="flex flex-row items-center gap-2">
          <UsersIcon />
          Public
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
