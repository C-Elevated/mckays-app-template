import { createClient } from "@/utils/supabase/server"

export default async function Page() {
  // Create the Supabase client
  const supabase = await createClient() // Await the resolved client

  // Fetch data from the "todos" table
  const { data: todos, error } = await supabase.from("todos").select()

  if (error) {
    console.error("Error fetching todos:", error)
    return <div>Error loading todos</div>
  }

  return (
    <ul>
      {todos?.map((todo: { id: number; title: string }) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  )
}
