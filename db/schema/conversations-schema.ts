/*
<ai_context>
Defines the database schema for conversations.
</ai_context>
*/

import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core"
import { usersTable } from "./users-schema"

export const conversationsTable = pgTable("conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => usersTable.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertConversation = typeof conversationsTable.$inferInsert
export type SelectConversation = typeof conversationsTable.$inferSelect
