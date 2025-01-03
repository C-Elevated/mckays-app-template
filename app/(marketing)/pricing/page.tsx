/*
<ai_context>
This server page displays pricing options for the product, integrating Stripe payment links.
</ai_context>
*/

"use server"

import { PricingCards } from "./_components/pricing-cards"
import { auth } from "@supabase/ssr"

export default async function PricingPage() {
  const { user } = await auth()
  const userId = user?.id

  return (
    <div className="container py-6">
      <PricingCards userId={userId} />
    </div>
  )
}
