"use client"

import { useEffect } from "react"

interface DataStreamHandlerProps {
  id: string
}

export function DataStreamHandler({ id }: DataStreamHandlerProps) {
  useEffect(() => {
    // Initialize Pyodide
    async function initPyodide() {
      try {
        // @ts-ignore
        const pyodide = await loadPyodide()
        // Store pyodide instance in window for global access
        // @ts-ignore
        window.pyodide = pyodide
      } catch (error) {
        console.error("Error initializing Pyodide:", error)
      }
    }

    initPyodide()
  }, [])

  return null
}
