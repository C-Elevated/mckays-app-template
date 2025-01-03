/*
<ai_context>
Contains server actions related to conversations in the DB.
</ai_context>
*/

"use server"

import { db } from "@/db/db"
import {
  InsertConversation,
  conversationsTable,
  SelectConversation
} from "@/db/schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"

export async function createConversationAction(
  data: InsertConversation
): Promise<ActionState<SelectConversation>> {
  try {
    const [newConversation] = await db
      .insert(conversationsTable)
      .values(data)
      .returning()

    return {
      isSuccess: true,
      message: "Conversation created successfully",
      data: newConversation
    }
  } catch (error) {
    console.error("Error creating conversation:", error)
    return { isSuccess: false, message: "Failed to create conversation" }
  }
}

export async function getConversationAction(
  id: string
): Promise<ActionState<SelectConversation>> {
  try {
    const conversation = await db.query.conversations.findFirst({
      where: eq(conversationsTable.id, id)
    })

    if (!conversation) {
      return { isSuccess: false, message: "Conversation not found" }
    }

    return {
      isSuccess: true,
      message: "Conversation retrieved successfully",
      data: conversation
    }
  } catch (error) {
    console.error("Error getting conversation:", error)
    return { isSuccess: false, message: "Failed to get conversation" }
  }
}

export async function getUserConversationsAction(
  userId: string
): Promise<ActionState<SelectConversation[]>> {
  try {
    const conversations = await db.query.conversations.findMany({
      where: eq(conversationsTable.userId, userId)
    })

    return {
      isSuccess: true,
      message: "Conversations retrieved successfully",
      data: conversations
    }
  } catch (error) {
    console.error("Error getting user conversations:", error)
    return { isSuccess: false, message: "Failed to get conversations" }
  }
}

export async function updateConversationAction(
  id: string,
  data: Partial<InsertConversation>
): Promise<ActionState<SelectConversation>> {
  try {
    const [updatedConversation] = await db
      .update(conversationsTable)
      .set(data)
      .where(eq(conversationsTable.id, id))
      .returning()

    if (!updatedConversation) {
      return { isSuccess: false, message: "Conversation not found to update" }
    }

    return {
      isSuccess: true,
      message: "Conversation updated successfully",
      data: updatedConversation
    }
  } catch (error) {
    console.error("Error updating conversation:", error)
    return { isSuccess: false, message: "Failed to update conversation" }
  }
}

export async function deleteConversationAction(
  id: string
): Promise<ActionState<void>> {
  try {
    await db.delete(conversationsTable).where(eq(conversationsTable.id, id))
    return {
      isSuccess: true,
      message: "Conversation deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting conversation:", error)
    return { isSuccess: false, message: "Failed to delete conversation" }
  }
} 