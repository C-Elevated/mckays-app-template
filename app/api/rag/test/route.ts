"use server"

import { NextResponse } from "next/server"
import { testRag } from "@/lib/rag/test-rag"

export async function POST(request: Request) {
  try {
    const { text } = await request.json()
    const result = await testRag(text)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error testing RAG:", error)
    return NextResponse.json({ error: "Failed to test RAG" }, { status: 500 })
  }
}
