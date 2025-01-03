/*
<ai_context>
This client component provides the providers for the app.
</ai_context>
*/

"use client"

import { PostHogProvider } from "./posthog/posthog-provider"
import { ThemeProvider } from "./theme/theme-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <PostHogProvider>{children}</PostHogProvider>
    </ThemeProvider>
  )
}
