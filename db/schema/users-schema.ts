/*
<ai_context>
Defines the database schema for users.
</ai_context>
*/

import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

// Create the enum first
export const membershipEnum = pgEnum("membership_type", ["free", "pro"])

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  membership: membershipEnum("membership").notNull().default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertUser = typeof usersTable.$inferInsert
export type SelectUser = typeof usersTable.$inferSelect
