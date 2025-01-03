import { pgTable, text, timestamp, uuid, vector } from "drizzle-orm/pg-core"
import { usersTable } from "./users-schema"

export const embeddingsTable = pgTable("embeddings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => usersTable.id)
    .notNull(),
  content: text("content").notNull(),
  embedding: vector("embedding", { dimensions: 256 }).notNull(),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertEmbedding = typeof embeddingsTable.$inferInsert
export type SelectEmbedding = typeof embeddingsTable.$inferSelect
