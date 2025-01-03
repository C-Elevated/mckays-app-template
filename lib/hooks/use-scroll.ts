"use client"

import { useEffect, useRef } from "react"
import { useInView } from "react-intersection-observer"

interface UseScrollOptions {
  behavior?: ScrollBehavior
  block?: ScrollLogicalPosition
  threshold?: number
  triggerOnMount?: boolean
}

export function useScroll<T extends HTMLElement>({
  behavior = "smooth",
  block = "end",
  threshold = 0,
  triggerOnMount = false
}: UseScrollOptions = {}) {
  const elementRef = useRef<T>(null)
  const { ref: inViewRef, entry } = useInView({ threshold })

  const scrollToBottom = () => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({ behavior, block })
    }
  }

  useEffect(() => {
    if (triggerOnMount) {
      scrollToBottom()
    }
  }, [triggerOnMount])

  useEffect(() => {
    if (elementRef.current && entry?.isIntersecting) {
      scrollToBottom()
    }
  }, [entry?.isIntersecting, behavior, block])

  return {
    elementRef,
    inViewRef,
    scrollToBottom,
    isInView: entry?.isIntersecting
  }
}
