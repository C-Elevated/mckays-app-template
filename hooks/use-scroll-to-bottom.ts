"use client"

import { useEffect, useRef } from "react"

export function useScrollToBottom<T extends HTMLElement>() {
  const containerRef = useRef<T>(null)
  const endRef = useRef<T>(null)

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  return [containerRef, endRef] as const
} 