"use client"

import { motion } from "framer-motion"
import Link from "next/link"

import { MessageIcon } from "@/components/chat/icons"
import { cn } from "@/lib/utils"

export function Overview() {
  return (
    <motion.div
      key="overview"
      className="mx-auto mt-8 max-w-3xl md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex max-w-xl flex-col gap-8 rounded-xl p-6 text-center leading-relaxed">
        <div className="flex flex-row items-center justify-center gap-4">
          <div className="bg-primary flex size-8 items-center justify-center rounded-full">
            <MessageIcon size={20} className="text-primary-foreground" />
          </div>
          <span className="text-lg font-medium">RagBot</span>
        </div>
        <p>
          This is a powerful RAG (Retrieval-Augmented Generation) chatbot that
          helps you interact with your documents and data in a natural way.
          Built with{" "}
          <Link
            href="https://nextjs.org"
            target="_blank"
            className={cn(
              "font-medium underline underline-offset-4",
              "hover:text-primary"
            )}
          >
            Next.js
          </Link>
          ,{" "}
          <Link
            href="https://supabase.com"
            target="_blank"
            className={cn(
              "font-medium underline underline-offset-4",
              "hover:text-primary"
            )}
          >
            Supabase
          </Link>
          , and{" "}
          <Link
            href="https://sdk.vercel.ai/docs"
            target="_blank"
            className={cn(
              "font-medium underline underline-offset-4",
              "hover:text-primary"
            )}
          >
            Vercel AI SDK
          </Link>
          .
        </p>
        <div className="text-muted-foreground space-y-4">
          <p>
            Upload your documents and start chatting with them instantly. The
            bot will use advanced RAG techniques to provide accurate, contextual
            responses.
          </p>
          <p>
            Features include document versioning, real-time chat, code
            execution, and more.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
