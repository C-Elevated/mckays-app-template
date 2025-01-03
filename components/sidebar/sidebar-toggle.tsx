"use client"

import type { ComponentProps } from "react"
import { PanelLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface SidebarToggleProps extends ComponentProps<typeof SidebarTrigger> {
  className?: string
}

export function SidebarToggle({ className }: SidebarToggleProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <SidebarTrigger variant="outline" className="h-fit px-2 md:h-fit">
          <PanelLeft className="size-4" />
        </SidebarTrigger>
      </TooltipTrigger>
      <TooltipContent align="start">Toggle Sidebar</TooltipContent>
    </Tooltip>
  )
}
