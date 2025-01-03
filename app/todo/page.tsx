/*
<ai_context>
This server page retrieves user todos from the database and renders them in a list.
</ai_context>
*/

"use server"

import { getTodosAction } from "@/actions/db/todos-actions"
import { TodoList } from "./_components/todo-list"

export default async function TodoPage() {
  const userId = "test-user" // Placeholder user ID
  const { data: todos } = await getTodosAction(userId)

  return (
    <div className="container py-6">
      <TodoList initialTodos={todos || []} userId={userId} />
    </div>
  )
}
