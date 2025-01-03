"use server"

import { revalidatePath } from "next/cache"
import { createId } from "@paralleldrive/cuid2"

import { db } from "@/db/db"
import { messagesTable } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function deleteTrailingMessages({
  chatId,
  messageId
}: {
  chatId: string
  messageId: string
}) {
  try {
    const messages = await db.query.messagesTable.findMany({
      where: eq(messagesTable.chatId, chatId),
      orderBy: messagesTable.createdAt
    })

    const messageIndex = messages.findIndex(message => message.id === messageId)

    if (messageIndex === -1) {
      return {
        error: "Message not found"
      }
    }

    const messagesToDelete = messages.slice(messageIndex + 1)

    if (messagesToDelete.length === 0) {
      return {
        error: "No messages to delete"
      }
    }

    await db
      .delete(messagesTable)
      .where(
        eq(messagesTable.id, messagesToDelete.map(message => message.id)[0])
      )

    revalidatePath(`/chat/${chatId}`)

    return {
      success: true
    }
  } catch (error) {
    return {
      error: "Failed to delete messages"
    }
  }
}

export async function updateMessage({
  id,
  content
}: {
  id: string
  content: string
}) {
  try {
    const [message] = await db
      .update(messagesTable)
      .set({
        content,
        id: createId()
      })
      .where(eq(messagesTable.id, id))
      .returning()

    revalidatePath(`/chat/${message.chatId}`)

    return {
      success: true
    }
  } catch (error) {
    return {
      error: "Failed to update message"
    }
  }
}
