"use server"

import { ELEPHANT_WIKI } from "./mock-data"
import { processDocument } from "@/lib/rag/processing/process-document"
import { runRagPipeline } from "@/lib/rag/retrieval/run-rag-pipeline"
import { generateCompletionWithContext } from "@/lib/rag/generation/generate-completion"

// Test function to process and query the elephant data
export async function testRagSystem() {
  try {
    // Step 1: Process the elephant wiki data
    console.log("Processing elephant wiki data...")
    await processDocument(ELEPHANT_WIKI)
    console.log("Data processing complete!")

    // Step 2: Test a query
    const testQuery =
      "What are the main physical characteristics of African Bush Elephants?"
    console.log("\nTesting query:", testQuery)

    // Get relevant context through RAG pipeline
    const relevantDocs = await runRagPipeline(testQuery)

    // Combine relevant documents into context
    const context = relevantDocs.map(doc => doc.content).join("\n\n")

    // Generate completion with context
    const answer = await generateCompletionWithContext(context, testQuery)
    console.log("\nAnswer:", answer)

    return {
      query: testQuery,
      relevantDocs,
      answer
    }
  } catch (error) {
    console.error("Error testing RAG system:", error)
    throw error
  }
}

export async function testRag(text: string) {
  // This is a placeholder for the actual RAG testing logic
  return {
    success: true,
    message: "RAG test successful",
    data: {
      text,
      score: 0.95
    }
  }
}
