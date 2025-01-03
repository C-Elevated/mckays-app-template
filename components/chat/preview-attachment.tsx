"use client"

import Image from "next/image"
import { LoaderIcon } from "./icons"

interface Attachment {
  name: string | null
  url: string
  contentType: string | null
}

interface PreviewAttachmentProps {
  attachment: Attachment
  isUploading?: boolean
}

export function PreviewAttachment({
  attachment,
  isUploading = false
}: PreviewAttachmentProps) {
  const { name, url, contentType } = attachment

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-muted relative flex aspect-video h-16 w-20 flex-col items-center justify-center rounded-md">
        {contentType ? (
          contentType.startsWith("image") ? (
            <Image
              key={url}
              src={url}
              alt={name ?? "An image attachment"}
              fill
              className="rounded-md object-cover"
            />
          ) : (
            <div className="size-full" />
          )
        ) : (
          <div className="size-full" />
        )}

        {isUploading && (
          <div className="text-muted-foreground absolute animate-spin">
            <LoaderIcon />
          </div>
        )}
      </div>
      <div className="text-muted-foreground max-w-16 truncate text-xs">
        {name}
      </div>
    </div>
  )
}
