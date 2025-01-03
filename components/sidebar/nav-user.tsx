/*
<ai_context>
This client component provides a user button for the sidebar via Clerk.
</ai_context>
*/

"use client"

import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

export function NavUser() {
  return (
    <Button variant="ghost" size="icon">
      <User className="size-5" />
    </Button>
  )
}
