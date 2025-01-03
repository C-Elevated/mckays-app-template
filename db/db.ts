/*
<ai_context>
Initializes the database connection and schema for the app.
</ai_context>
*/

import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { conversationsTable, messagesTable, usersTable } from "@/db/schema"

const connectionString = process.env.DATABASE_URL!
const client = postgres(connectionString)
export const db = drizzle(client, {
  schema: {
    users: usersTable,
    conversations: conversationsTable,
    messages: messagesTable
  }
})
