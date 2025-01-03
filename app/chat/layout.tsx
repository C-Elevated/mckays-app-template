"use server"

import { cookies } from "next/headers"
import Script from "next/script"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { createClient } from "@/components/utilities/supabase/server"

export default async function ChatLayout({
  children
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const supabase = await createClient()

  const {
    data: { session }
  } = await supabase.auth.getSession()

  const isCollapsed = cookieStore.get("sidebar:state")?.value !== "true"

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <SidebarProvider defaultOpen={!isCollapsed}>
        <AppSidebar user={session?.user} />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </>
  )
}
