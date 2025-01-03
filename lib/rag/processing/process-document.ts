"use server"

import { db } from "@/db/db"
import { embeddingsTable } from "@/db/schema"
import { generateEmbeddings } from "../generation/generate-embeddings"
import { splitText } from "./split-text"
import { getUser } from "@/lib/supabase/server"

// Processes a document by splitting it into chunks, generating embeddings, and storing in DB
export async function processDocument(text: string, userId: string) {
  // Verify user on server side
  const { user, error } = await getUser()

  if (error || !user || user.id !== userId) {
    throw new Error("Unauthorized")
  }

  // Split input text into smaller chunks for processing
  const chunks = await splitText(text)

  // Generate vector embeddings for each text chunk
  const embeddings = await generateEmbeddings(chunks)

  // Store chunks and their embeddings in the database
  await db.insert(embeddingsTable).values(
    chunks.map((chunk, i) => ({
      content: chunk,
      embedding: embeddings[i],
      userId
    }))
  )
}
