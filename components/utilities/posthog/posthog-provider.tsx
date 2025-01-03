/*
<ai_context>
This client component provides the PostHog provider for the app.
</ai_context>
*/

"use client"

import { PostHogUserIdentify } from "@/components/utilities/posthog/posthog-user-identity"
import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
    loaded: posthog => {
      if (process.env.NODE_ENV === "development") posthog.debug()
    }
  })
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <PostHogUserIdentify />
      {children}
    </PHProvider>
  )
}
