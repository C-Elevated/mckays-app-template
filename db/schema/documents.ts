import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { BlockKind } from "@/types/block"

export const documentsTable = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content"),
  kind: text("kind").$type<BlockKind>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type Document = typeof documentsTable.$inferSelect
export type InsertDocument = typeof documentsTable.$inferInsert
