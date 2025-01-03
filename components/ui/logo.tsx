"use client"

import { Rocket } from "lucide-react"
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Rocket className="size-6" />
      <span className="font-bold">Mckay's App Template</span>
    </Link>
  )
}
