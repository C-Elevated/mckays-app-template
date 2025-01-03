/*
<ai_context>
This server layout provides a shared header and basic structure for (marketing) routes.
</ai_context>
*/

"use server"

import { Header } from "@/components/header"
import { BaseLayout } from "@/components/layouts/base-layout"

export default async function MarketingLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <BaseLayout header={<Header />}>{children}</BaseLayout>
}
