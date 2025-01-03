"use client"

import { createClient } from "@/components/utilities/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function Dashboard() {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast({
        title: "Error",
        description: error.message
      })
    } else {
      router.push("/sign-in")
      router.refresh()
      toast({
        title: "Success",
        description: "Action completed successfully!"
      })
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
