/*
<ai_context>
Contains server actions related to users in the DB.
</ai_context>
*/

"use server"

import { db } from "@/db/db"
import {
  InsertUser,
  usersTable,
  SelectUser
} from "@/db/schema/users-schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"

export async function createUserAction(
  data: InsertUser
): Promise<ActionState<SelectUser>> {
  try {
    const [newUser] = await db.insert(usersTable).values(data).returning()
    return {
      isSuccess: true,
      message: "User created successfully",
      data: newUser
    }
  } catch (error) {
    console.error("Error creating user:", error)
    return { isSuccess: false, message: "Failed to create user" }
  }
}

export async function getUserByUserIdAction(
  userId: string
): Promise<ActionState<SelectUser>> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(usersTable.userId, userId)
    })
    if (!user) {
      return { isSuccess: false, message: "User not found" }
    }

    return {
      isSuccess: true,
      message: "User retrieved successfully",
      data: user
    }
  } catch (error) {
    console.error("Error getting user by user id", error)
    return { isSuccess: false, message: "Failed to get user" }
  }
}

export async function updateUserAction(
  userId: string,
  data: Partial<InsertUser>
): Promise<ActionState<SelectUser>> {
  try {
    const [updatedUser] = await db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.userId, userId))
      .returning()

    if (!updatedUser) {
      return { isSuccess: false, message: "User not found to update" }
    }

    return {
      isSuccess: true,
      message: "User updated successfully",
      data: updatedUser
    }
  } catch (error) {
    console.error("Error updating user:", error)
    return { isSuccess: false, message: "Failed to update user" }
  }
}

export async function updateUserByStripeCustomerIdAction(
  stripeCustomerId: string,
  data: Partial<InsertUser>
): Promise<ActionState<SelectUser>> {
  try {
    const [updatedUser] = await db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.stripeCustomerId, stripeCustomerId))
      .returning()

    if (!updatedUser) {
      return {
        isSuccess: false,
        message: "User not found by Stripe customer ID"
      }
    }

    return {
      isSuccess: true,
      message: "User updated by Stripe customer ID successfully",
      data: updatedUser
    }
  } catch (error) {
    console.error("Error updating user by stripe customer ID:", error)
    return {
      isSuccess: false,
      message: "Failed to update user by Stripe customer ID"
    }
  }
}

export async function deleteUserAction(
  userId: string
): Promise<ActionState<void>> {
  try {
    await db.delete(usersTable).where(eq(usersTable.userId, userId))
    return {
      isSuccess: true,
      message: "User deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { isSuccess: false, message: "Failed to delete user" }
  }
}