"use server"

import { db } from "@/db/db"
import { embeddingsTable } from "@/db/schema"
import { cosineDistance, desc, gt, sql, and, eq } from "drizzle-orm"
import { generateEmbeddings } from "../generation/generate-embeddings"
import { getUser } from "@/lib/supabase/server"

// Retrieves relevant documents from the database based on semantic similarity to input text
export async function retrieveDocuments(
  input: string,
  options: { limit?: number; minSimilarity?: number } = {}
) {
  // Verify user on server side
  const { user, error } = await getUser()

  if (error || !user) {
    throw new Error("Unauthorized")
  }

  // Set default options for result limit and minimum similarity threshold
  const { limit = 10, minSimilarity = 0.3 } = options

  // Generate vector embedding for input text
  const embeddings = await generateEmbeddings([input])
  // Calculate cosine similarity between input embedding and stored embeddings
  const similarity = sql<number>`1 - (${cosineDistance(embeddingsTable.embedding, embeddings[0])})`

  // Query database for relevant documents
  const documents = await db
    .select({
      content: embeddingsTable.content,
      similarity
    })
    .from(embeddingsTable)
    // Filter by minimum similarity and user
    .where(
      and(gt(similarity, minSimilarity), eq(embeddingsTable.userId, user.id))
    )
    // Sort by highest similarity first
    .orderBy(t => desc(t.similarity))
    // Limit number of results
    .limit(limit)

  return documents
}
