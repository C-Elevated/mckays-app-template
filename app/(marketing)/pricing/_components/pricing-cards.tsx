"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface PricingCardsProps {
  userId: string | undefined
}

export function PricingCards({ userId }: PricingCardsProps) {
  return (
    <>
      <h1 className="mb-8 text-center text-3xl font-bold">Choose Your Plan</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <PricingCard
          title="Monthly Plan"
          price="$10"
          description="Billed monthly"
          features={[
            "Unlimited conversations",
            "Priority support",
            "Advanced features",
            "API access"
          ]}
          buttonText="Subscribe Monthly"
          buttonLink={
            process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY || "#"
          }
          userId={userId}
          popular={false}
        />
        <PricingCard
          title="Yearly Plan"
          price="$100"
          description="Billed annually (Save 17%)"
          features={[
            "Everything in Monthly",
            "2 months free",
            "Early access to features",
            "Premium support"
          ]}
          buttonText="Subscribe Yearly"
          buttonLink={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY || "#"}
          userId={userId}
          popular={true}
        />
      </div>
    </>
  )
}

interface PricingCardProps {
  title: string
  price: string
  description: string
  features: string[]
  buttonText: string
  buttonLink: string
  userId: string | undefined
  popular: boolean
}

function PricingCard({
  title,
  price,
  description,
  features,
  buttonText,
  buttonLink,
  userId,
  popular
}: PricingCardProps) {
  const finalButtonLink = userId
    ? `${buttonLink}?client_reference_id=${userId}`
    : "#"

  return (
    <Card className={cn("flex h-full flex-col", popular && "border-primary")}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{title}</CardTitle>
          {popular && <Badge>Most Popular</Badge>}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex grow flex-col justify-between">
        <div>
          <p className="mb-4 text-4xl font-bold">{price}</p>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <svg
                  className="mr-2 size-4 text-green-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className={cn(
            "w-full",
            popular && "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
          asChild
          disabled={!userId}
        >
          <a
            href={finalButtonLink}
            className={cn(
              "inline-flex items-center justify-center",
              buttonLink === "#" && "pointer-events-none opacity-50"
            )}
          >
            {!userId ? "Sign in to subscribe" : buttonText}
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
