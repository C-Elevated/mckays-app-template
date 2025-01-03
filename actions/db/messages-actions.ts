/*
<ai_context>
Contains server actions related to messages in the DB.
</ai_context>
*/

"use server"

import { db } from "@/db/db"
import {
  InsertMessage,
  messagesTable,
  SelectMessage
} from "@/db/schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"

export async function createMessageAction(
  data: InsertMessage
): Promise<ActionState<SelectMessage>> {
  try {
    const [newMessage] = await db.insert(messagesTable).values(data).returning()
    return {
      isSuccess: true,
      message: "Message created successfully",
      data: newMessage
    }
  } catch (error) {
    console.error("Error creating message:", error)
    return { isSuccess: false, message: "Failed to create message" }
  }
}

export async function getMessageAction(
  id: string
): Promise<ActionState<SelectMessage>> {
  try {
    const message = await db.query.messages.findFirst({
      where: eq(messagesTable.id, id)
    })

    if (!message) {
      return { isSuccess: false, message: "Message not found" }
    }

    return {
      isSuccess: true,
      message: "Message retrieved successfully",
      data: message
    }
  } catch (error) {
    console.error("Error getting message:", error)
    return { isSuccess: false, message: "Failed to get message" }
  }
}

export async function getConversationMessagesAction(
  conversationId: string
): Promise<ActionState<SelectMessage[]>> {
  try {
    const messages = await db.query.messages.findMany({
      where: eq(messagesTable.conversationId, conversationId)
    })

    return {
      isSuccess: true,
      message: "Messages retrieved successfully",
      data: messages
    }
  } catch (error) {
    console.error("Error getting conversation messages:", error)
    return { isSuccess: false, message: "Failed to get messages" }
  }
}

export async function updateMessageAction(
  id: string,
  data: Partial<InsertMessage>
): Promise<ActionState<SelectMessage>> {
  try {
    const [updatedMessage] = await db
      .update(messagesTable)
      .set(data)
      .where(eq(messagesTable.id, id))
      .returning()

    if (!updatedMessage) {
      return { isSuccess: false, message: "Message not found to update" }
    }

    return {
      isSuccess: true,
      message: "Message updated successfully",
      data: updatedMessage
    }
  } catch (error) {
    console.error("Error updating message:", error)
    return { isSuccess: false, message: "Failed to update message" }
  }
}

export async function deleteMessageAction(
  id: string
): Promise<ActionState<void>> {
  try {
    await db.delete(messagesTable).where(eq(messagesTable.id, id))
    return {
      isSuccess: true,
      message: "Message deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting message:", error)
    return { isSuccess: false, message: "Failed to delete message" }
  }
} 