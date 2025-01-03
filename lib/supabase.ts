import { createClient } from "@supabase/supabase-js"
import { Database } from "@/types/supabase"

// For client-side usage
export const createClientComponentClient = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

// For server-side usage
export const createServerComponentClient = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }
  )

// Default client for simple usage
export const supabase = createClientComponentClient()
