/*
<ai_context>
This client component identifies the user in PostHog.
</ai_context>
*/

"use client"

import { useEffect } from "react"
import posthog from "posthog-js"

export function PostHogUserIdentify() {
  useEffect(() => {
    posthog.identify(undefined, {
      name: undefined,
      email: undefined
    })
  }, [])

  return null
}
