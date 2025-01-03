/*
<ai_context>
Defines the database schema for messages.
</ai_context>
*/

import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { conversationsTable } from "./conversations-schema"
import { usersTable } from "./users-schema"

export const roleEnum = pgEnum("role", ["user", "assistant", "system"])

export const messagesTable = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  conversationId: uuid("conversation_id")
    .references(() => conversationsTable.id, { onDelete: "cascade" })
    .notNull(),
  senderId: uuid("sender_id")
    .references(() => usersTable.id)
    .notNull(),
  role: roleEnum("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
})

export type InsertMessage = typeof messagesTable.$inferInsert
export type SelectMessage = typeof messagesTable.$inferSelect
