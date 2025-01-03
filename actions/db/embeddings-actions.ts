"use server"

import { db } from "@/db/db"
import { InsertEmbedding, SelectEmbedding, embeddingsTable } from "@/db/schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"

export async function createEmbeddingAction(
  data: InsertEmbedding
): Promise<ActionState<SelectEmbedding>> {
  try {
    const [newEmbedding] = await db
      .insert(embeddingsTable)
      .values(data)
      .returning()
    return {
      isSuccess: true,
      message: "Embedding created successfully",
      data: newEmbedding
    }
  } catch (error) {
    console.error("Error creating embedding:", error)
    return { isSuccess: false, message: "Failed to create embedding" }
  }
}

export async function getEmbeddingAction(
  id: string
): Promise<ActionState<SelectEmbedding>> {
  try {
    const embedding = await db.query.embeddings.findFirst({
      where: eq(embeddingsTable.id, id)
    })

    if (!embedding) {
      return { isSuccess: false, message: "Embedding not found" }
    }

    return {
      isSuccess: true,
      message: "Embedding retrieved successfully",
      data: embedding
    }
  } catch (error) {
    console.error("Error getting embedding:", error)
    return { isSuccess: false, message: "Failed to get embedding" }
  }
}

export async function getUserEmbeddingsAction(
  userId: string
): Promise<ActionState<SelectEmbedding[]>> {
  try {
    const embeddings = await db.query.embeddings.findMany({
      where: eq(embeddingsTable.userId, userId)
    })

    return {
      isSuccess: true,
      message: "Embeddings retrieved successfully",
      data: embeddings
    }
  } catch (error) {
    console.error("Error getting user embeddings:", error)
    return { isSuccess: false, message: "Failed to get embeddings" }
  }
}

export async function updateEmbeddingAction(
  id: string,
  data: Partial<InsertEmbedding>
): Promise<ActionState<SelectEmbedding>> {
  try {
    const [updatedEmbedding] = await db
      .update(embeddingsTable)
      .set(data)
      .where(eq(embeddingsTable.id, id))
      .returning()

    if (!updatedEmbedding) {
      return { isSuccess: false, message: "Embedding not found to update" }
    }

    return {
      isSuccess: true,
      message: "Embedding updated successfully",
      data: updatedEmbedding
    }
  } catch (error) {
    console.error("Error updating embedding:", error)
    return { isSuccess: false, message: "Failed to update embedding" }
  }
}

export async function deleteEmbeddingAction(
  id: string
): Promise<ActionState<void>> {
  try {
    await db.delete(embeddingsTable).where(eq(embeddingsTable.id, id))
    return {
      isSuccess: true,
      message: "Embedding deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting embedding:", error)
    return { isSuccess: false, message: "Failed to delete embedding" }
  }
} 