"use client"

import { cn } from "@/lib/utils"

interface BaseLayoutProps {
  children: React.ReactNode
  header?: React.ReactNode
  sidebar?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function BaseLayout({
  children,
  header,
  sidebar,
  footer,
  className
}: BaseLayoutProps) {
  return (
    <div className={cn("flex min-h-screen flex-col", className)}>
      {header}
      <div className="flex flex-1">
        {sidebar}
        <main className="flex-1">{children}</main>
      </div>
      {footer}
    </div>
  )
}
