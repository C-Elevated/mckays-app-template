import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { CookieOptions } from "@supabase/ssr"

export async function getUser() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Unable to set cookie
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options, maxAge: 0 })
          } catch (error) {
            // Unable to remove cookie
          }
        }
      }
    }
  )

  const {
    data: { user },
    error
  } = await supabase.auth.getUser()
  return { user, error }
}
