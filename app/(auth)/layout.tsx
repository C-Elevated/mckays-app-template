/*
<ai_context>
This server layout provides a centered layout for (auth) pages.
</ai_context>
*/

"use server"

import { BaseLayout } from "@/components/layouts/base-layout"

interface AuthLayoutProps {
  children: React.ReactNode
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <BaseLayout className="items-center justify-center">{children}</BaseLayout>
  )
}
