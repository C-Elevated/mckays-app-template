"use server"

import {
  updateUserAction,
  updateUserByStripeCustomerIdAction
} from "@/actions/db/users-actions"
import { SelectUser } from "@/db/schema"
import { stripe } from "@/lib/stripe"
import { ActionState } from "@/types"
import Stripe from "stripe"

type MembershipStatus = SelectUser["membership"]

const getMembershipStatus = (
  status: Stripe.Subscription.Status,
  membership: MembershipStatus
): MembershipStatus => {
  switch (status) {
    case "active":
    case "trialing":
      return membership
    case "canceled":
    case "incomplete":
    case "incomplete_expired":
    case "past_due":
    case "paused":
    case "unpaid":
      return "free"
    default:
      return "free"
  }
}

const getSubscription = async (subscriptionId: string) => {
  return stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method", "customer", "items.data.price.product"]
  })
}

export async function updateStripeCustomer(
  userId: string,
  subscriptionId: string,
  customerId: string
): Promise<ActionState<SelectUser>> {
  try {
    if (!userId || !subscriptionId || !customerId) {
      throw new Error("Missing required parameters for updateStripeCustomer")
    }

    const subscription = await getSubscription(subscriptionId)
    const product = subscription.items.data[0]?.price?.product as Stripe.Product

    if (!product?.metadata?.membership) {
      throw new Error("Product is missing membership metadata")
    }

    const membershipStatus = getMembershipStatus(
      subscription.status,
      product.metadata.membership as MembershipStatus
    )

    const result = await updateUserAction(userId, {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      membership: membershipStatus
    })

    if (!result.isSuccess) {
      throw new Error("Failed to update customer user")
    }

    return result
  } catch (error) {
    console.error("Error in updateStripeCustomer:", error)
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : "Failed to update Stripe customer"
    }
  }
}

export async function manageSubscriptionStatusChange(
  subscriptionId: string,
  customerId: string,
  productId: string
): Promise<ActionState<MembershipStatus>> {
  try {
    if (!subscriptionId || !customerId || !productId) {
      throw new Error(
        "Missing required parameters for manageSubscriptionStatusChange"
      )
    }

    const subscription = await getSubscription(subscriptionId)
    const product = await stripe.products.retrieve(productId)

    if (!product?.metadata?.membership) {
      throw new Error("Product is missing membership metadata")
    }

    const membership = product.metadata.membership as MembershipStatus

    if (!["free", "pro"].includes(membership)) {
      throw new Error(
        `Invalid membership type in product metadata: ${membership}`
      )
    }

    const membershipStatus = getMembershipStatus(
      subscription.status,
      membership
    )

    const updateResult = await updateUserByStripeCustomerIdAction(
      customerId,
      {
        stripeSubscriptionId: subscription.id,
        membership: membershipStatus
      }
    )

    if (!updateResult.isSuccess) {
      throw new Error("Failed to update subscription status")
    }

    return {
      isSuccess: true,
      message: "Subscription status updated successfully",
      data: membershipStatus
    }
  } catch (error) {
    console.error("Error in manageSubscriptionStatusChange:", error)
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : "Failed to update subscription status"
    }
  }
}

export async function getSubscriptionStatus(
  subscriptionId: string
): Promise<ActionState<{
  status: Stripe.Subscription.Status
  membership: MembershipStatus
  currentPeriodEnd: number
}>> {
  try {
    if (!subscriptionId) {
      throw new Error("Missing subscription ID")
    }

    const subscription = await getSubscription(subscriptionId)
    const product = subscription.items.data[0]?.price?.product as Stripe.Product

    if (!product?.metadata?.membership) {
      throw new Error("Product is missing membership metadata")
    }

    const membership = product.metadata.membership as MembershipStatus
    const membershipStatus = getMembershipStatus(subscription.status, membership)

    return {
      isSuccess: true,
      message: "Subscription status retrieved successfully",
      data: {
        status: subscription.status,
        membership: membershipStatus,
        currentPeriodEnd: subscription.current_period_end
      }
    }
  } catch (error) {
    console.error("Error in getSubscriptionStatus:", error)
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : "Failed to get subscription status"
    }
  }
}
