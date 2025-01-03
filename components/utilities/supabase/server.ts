import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies() // Await cookies() since it returns a Promise

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookie = await cookieStore.get(name) // Await get method
          return cookie?.value || null
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            await cookieStore.set(name, value, {
              path: "/",
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              ...options
            })
          } catch (error) {
            console.error(`Error setting cookie: ${name}`, error)
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            await cookieStore.set(name, "", {
              path: "/",
              expires: new Date(0),
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              ...options
            })
          } catch (error) {
            console.error(`Error removing cookie: ${name}`, error)
          }
        }
      }
    }
  )
}
