"use client"

import { ChevronUp } from "lucide-react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { createClientComponentClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

interface NavUserProps {
  user: {
    email: string | undefined
    id: string
  }
}

export function NavUser({ user }: NavUserProps) {
  const { setTheme, theme } = useTheme()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push("/")
  }

  return (
    <div className="px-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-10 w-full items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2">
              <Image
                src={`https://avatar.vercel.sh/${user.email}`}
                alt={user.email ?? "User Avatar"}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="truncate text-sm">{user?.email}</span>
            </div>
            <ChevronUp className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          align="start"
          className="w-[--radix-popper-anchor-width]"
        >
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {`Toggle ${theme === "light" ? "dark" : "light"} mode`}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onSelect={handleSignOut}>
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
