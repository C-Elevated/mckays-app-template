/*
<ai_context>
This server page retrieves user todos from the database and renders them in a list.
</ai_context>
*/

"use server"

import { getTodosAction } from "@/actions/db/todos-actions"
import { TodoList } from "./_components/todo-list"
import { auth } from "@supabase/ssr"

export default async function TodoPage() {
  const { user } = await auth()
  const userId = user?.id
  const { data: todos } = await getTodosAction(userId)

  return (
    <div className="container py-6">
      <TodoList initialTodos={todos || []} userId={userId} />
    </div>
  )
}
