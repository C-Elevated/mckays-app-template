"use server"

import { db } from "@/db/db"
import { InsertBlock, SelectBlock, blocksTable } from "@/db/schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"

export async function createBlockAction(
  data: InsertBlock
): Promise<ActionState<SelectBlock>> {
  try {
    const [newBlock] = await db.insert(blocksTable).values(data).returning()
    return {
      isSuccess: true,
      message: "Block created successfully",
      data: newBlock
    }
  } catch (error) {
    console.error("Error creating block:", error)
    return { isSuccess: false, message: "Failed to create block" }
  }
}

export async function getBlockAction(
  id: string
): Promise<ActionState<SelectBlock>> {
  try {
    const block = await db.query.blocks.findFirst({
      where: eq(blocksTable.id, id)
    })

    if (!block) {
      return { isSuccess: false, message: "Block not found" }
    }

    return {
      isSuccess: true,
      message: "Block retrieved successfully",
      data: block
    }
  } catch (error) {
    console.error("Error getting block:", error)
    return { isSuccess: false, message: "Failed to get block" }
  }
}

export async function getUserBlocksAction(
  userId: string
): Promise<ActionState<SelectBlock[]>> {
  try {
    const blocks = await db.query.blocks.findMany({
      where: eq(blocksTable.userId, userId)
    })

    return {
      isSuccess: true,
      message: "Blocks retrieved successfully",
      data: blocks
    }
  } catch (error) {
    console.error("Error getting user blocks:", error)
    return { isSuccess: false, message: "Failed to get blocks" }
  }
}

export async function updateBlockAction(
  id: string,
  data: Partial<InsertBlock>
): Promise<ActionState<SelectBlock>> {
  try {
    const [updatedBlock] = await db
      .update(blocksTable)
      .set(data)
      .where(eq(blocksTable.id, id))
      .returning()

    if (!updatedBlock) {
      return { isSuccess: false, message: "Block not found to update" }
    }

    return {
      isSuccess: true,
      message: "Block updated successfully",
      data: updatedBlock
    }
  } catch (error) {
    console.error("Error updating block:", error)
    return { isSuccess: false, message: "Failed to update block" }
  }
}

export async function deleteBlockAction(id: string): Promise<ActionState<void>> {
  try {
    await db.delete(blocksTable).where(eq(blocksTable.id, id))
    return {
      isSuccess: true,
      message: "Block deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting block:", error)
    return { isSuccess: false, message: "Failed to delete block" }
  }
} 