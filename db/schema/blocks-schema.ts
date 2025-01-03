import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { BlockKind } from "@/types/block"
import { usersTable } from "./users-schema"

export const blocksTable = pgTable("blocks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => usersTable.id)
    .notNull(),
  title: text("title").notNull(),
  content: text("content"),
  kind: text("kind").$type<BlockKind>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertBlock = typeof blocksTable.$inferInsert
export type SelectBlock = typeof blocksTable.$inferSelect
