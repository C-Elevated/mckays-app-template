"use client"

import { useRouter } from "next/navigation"
import { User } from "@supabase/supabase-js"
import useSWR from "swr"

import { fetcher } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageIcon } from "@/components/chat/icons"

interface ChatHistory {
  id: string
  title: string
  createdAt: string
}

interface SidebarHistoryProps {
  user: User | null
}

export function SidebarHistory({ user }: SidebarHistoryProps) {
  const router = useRouter()
  const { data: history } = useSWR<ChatHistory[]>(
    user ? "/api/history" : null,
    fetcher
  )

  if (!user || !history) return null

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-2 p-4">
        {history.map(chat => (
          <Button
            key={chat.id}
            variant="ghost"
            className="h-auto justify-start gap-2 px-4 py-3"
            onClick={() => {
              router.push(`/chat/${chat.id}`)
            }}
          >
            <MessageIcon />
            <div className="flex flex-col items-start gap-1">
              <div className="line-clamp-1 text-sm">{chat.title}</div>
              <div className="text-muted-foreground line-clamp-1 text-xs">
                {new Date(chat.createdAt).toLocaleDateString()}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </ScrollArea>
  )
}
