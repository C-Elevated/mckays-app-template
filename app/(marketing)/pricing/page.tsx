/*
<ai_context>
This server page displays pricing options for the product, integrating Stripe payment links.
</ai_context>
*/

"use server"

import { PricingCards } from "./_components/pricing-cards"

export default async function PricingPage() {
  const userId = "test-user" // Placeholder user ID

  return (
    <div className="container py-6">
      <PricingCards userId={userId} />
    </div>
  )
}
