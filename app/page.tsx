"use server"

import { createClient } from "@/components/utilities/supabase/server"
import { redirect } from "next/navigation"

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/sign-in")
  }

  redirect("/protected/dashboard")
}
