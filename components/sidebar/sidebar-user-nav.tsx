"use client"

import { useRouter } from "next/navigation"
import { User } from "@supabase/supabase-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface SidebarUserNavProps {
  user: User
}

export function SidebarUserNav({ user }: SidebarUserNavProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-12 w-full justify-start px-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex flex-col space-y-0.5 text-left">
                <p className="text-sm font-medium">
                  {user.user_metadata.full_name || user.email}
                </p>
                <p className="text-muted-foreground text-xs">{user.email}</p>
              </div>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[180px]">
        <DropdownMenuItem
          onClick={async () => {
            await supabase.auth.signOut()
            router.refresh()
          }}
        >
          Log out
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a
            href="https://github.com/yourusername/yourrepo"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
