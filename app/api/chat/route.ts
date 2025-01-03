export async function POST(req: Request) {
  const json = await req.json()
  const { messages, modelId, context } = json
  const userId = (await auth())?.user?.id

  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    const completion = await openai.chat.completions.create({
      model: modelId,
      stream: true,
      messages: [
        {
          role: "system",
          content: context
            ? `Based on the following context:\n\n${context}\n\nPlease answer: `
            : "You are a helpful AI assistant."
        },
        ...messages
      ]
    })

    const stream = OpenAIStream(completion)
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error("Error in chat route:", error)
    return new Response("Error", { status: 500 })
  }
}
