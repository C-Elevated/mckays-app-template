"use server"

import { NextResponse } from "next/server"
import { createId } from "@paralleldrive/cuid2"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const cookieStore = cookies()
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          }
        }
      }
    )

    const {
      data: { user },
      error: authError
    } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        {
          status: 401
        }
      )
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        {
          status: 400
        }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileId = createId()
    const ext = file.name.split(".").pop()
    const pathname = `${fileId}${ext ? `.${ext}` : ""}`

    const { error: uploadError } = await supabase.storage
      .from("attachments")
      .upload(`${user.id}/${pathname}`, buffer, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) {
      console.error("Error uploading file:", uploadError)
      return NextResponse.json(
        { error: "Error uploading file" },
        {
          status: 500
        }
      )
    }

    const {
      data: { publicUrl }
    } = supabase.storage
      .from("attachments")
      .getPublicUrl(`${user.id}/${pathname}`)

    return NextResponse.json({
      url: publicUrl,
      pathname,
      contentType: file.type
    })
  } catch (error) {
    console.error("Error in upload route:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500
      }
    )
  }
}
