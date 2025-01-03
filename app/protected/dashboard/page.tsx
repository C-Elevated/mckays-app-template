"use client"

import { createClient } from "@/components/utilities/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function Dashboard() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
    } else {
      router.push("/sign-in")
      router.refresh()
    }
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={handleSignOut} variant="outline">
          Sign Out
        </Button>
      </div>
      <p>Welcome to your protected dashboard!</p>
    </div>
  )
}
