"use server"

import { cookies } from "next/headers"
import { notFound } from "next/navigation"

import { createClient } from "@/components/utilities/supabase/server"
import { Chat } from "@/components/chat/chat"
import { DEFAULT_MODEL_NAME, models } from "@/lib/ai/models"
import { DataStreamHandler } from "@/components/chat/data-stream-handler"
import { db } from "@/db/db"
import { conversationsTable, messagesTable } from "@/db/schema"
import { eq } from "drizzle-orm"

async function getChatById(id: string) {
  return await db.query.conversationsTable.findFirst({
    where: eq(conversationsTable.id, id)
  })
}

async function getMessagesByChatId(id: string) {
  return await db.query.messagesTable.findMany({
    where: eq(messagesTable.chatId, id),
    orderBy: messagesTable.createdAt
  })
}

function convertToUIMessages(messages: (typeof messagesTable.$inferSelect)[]) {
  return messages.map(message => ({
    id: message.id,
    content: message.content,
    role: message.role,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt
  }))
}

export default async function ChatPage({ params }: { params: { id: string } }) {
  const { id } = params
  const chat = await getChatById(id)

  if (!chat) {
    notFound()
  }

  const supabase = await createClient()
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (chat.visibility === "private") {
    if (!session?.user) {
      return notFound()
    }

    if (session.user.id !== chat.userId) {
      return notFound()
    }
  }

  const messagesFromDb = await getMessagesByChatId(id)

  const cookieStore = cookies()
  const modelIdFromCookie = cookieStore.get("model-id")?.value
  const selectedModelId =
    models.find(model => model.id === modelIdFromCookie)?.id ||
    DEFAULT_MODEL_NAME

  return (
    <>
      <Chat
        id={chat.id}
        initialMessages={convertToUIMessages(messagesFromDb)}
        selectedModelId={selectedModelId}
        selectedVisibilityType={chat.visibility}
        isReadonly={session?.user?.id !== chat.userId}
      />
      <DataStreamHandler id={id} />
    </>
  )
}
