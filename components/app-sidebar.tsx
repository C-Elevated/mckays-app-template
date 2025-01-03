"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { User } from "@supabase/supabase-js"

import { PlusIcon } from "@/components/chat/icons"
import { SidebarHistory } from "@/components/sidebar/sidebar-history"
import { SidebarUserNav } from "@/components/sidebar/sidebar-user-nav"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"

interface AppSidebarProps {
  user: User | null
}

export function AppSidebar({ user }: AppSidebarProps) {
  const router = useRouter()
  const { setOpenMobile } = useSidebar()

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row items-center justify-between">
            <Link
              href="/"
              onClick={() => {
                setOpenMobile(false)
              }}
              className="flex flex-row items-center gap-3"
            >
              <span className="hover:bg-muted cursor-pointer rounded-md px-2 text-lg font-semibold">
                Chatbot
              </span>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="h-fit p-2"
                  onClick={() => {
                    setOpenMobile(false)
                    router.push("/")
                    router.refresh()
                  }}
                >
                  <PlusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end">New Chat</TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarHistory user={user} />
      </SidebarContent>
      <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter>
    </Sidebar>
  )
}
