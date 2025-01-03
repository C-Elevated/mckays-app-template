"use client"

import {
  X,
  Loader2,
  MessageSquare,
  FileText,
  Pencil,
  Copy,
  Play,
  History,
  Undo,
  Redo,
  Terminal,
  ThumbsUp,
  ThumbsDown,
  Code,
  CircleDot,
  Share,
  Eye,
  EyeOff,
  Users
} from "lucide-react"

interface IconProps {
  className?: string
  size?: number
}

export function FileIcon({ className, size = 16 }: IconProps) {
  return <FileText className={className} width={size} height={size} />
}

export function MessageIcon({ className, size = 16 }: IconProps) {
  return <MessageSquare className={className} width={size} height={size} />
}

export function PencilEditIcon({ className, size = 16 }: IconProps) {
  return <Pencil className={className} width={size} height={size} />
}

export function CrossIcon({ className, size = 16 }: IconProps) {
  return <X className={className} width={size} height={size} />
}

export function CrossSmallIcon({ className, size = 16 }: IconProps) {
  return <X className={className} width={size} height={size} />
}

export function LoaderIcon({ className, size = 16 }: IconProps) {
  return <Loader2 className={className} width={size} height={size} />
}

export function TerminalWindowIcon({ className, size = 16 }: IconProps) {
  return <Terminal className={className} width={size} height={size} />
}

export function CopyIcon({ className, size = 16 }: IconProps) {
  return <Copy className={className} width={size} height={size} />
}

export function PlayIcon({ className, size = 16 }: IconProps) {
  return <Play className={className} width={size} height={size} />
}

export function ClockRewind({ className, size = 16 }: IconProps) {
  return <History className={className} width={size} height={size} />
}

export function UndoIcon({ className, size = 16 }: IconProps) {
  return <Undo className={className} width={size} height={size} />
}

export function RedoIcon({ className, size = 16 }: IconProps) {
  return <Redo className={className} width={size} height={size} />
}

export function ThumbUpIcon({ className, size = 16 }: IconProps) {
  return <ThumbsUp className={className} width={size} height={size} />
}

export function ThumbDownIcon({ className, size = 16 }: IconProps) {
  return <ThumbsDown className={className} width={size} height={size} />
}

export function CodeIcon({ className, size = 16 }: IconProps) {
  return <Code className={className} width={size} height={size} />
}

export function PythonIcon({ className, size = 16 }: IconProps) {
  return <CircleDot className={className} width={size} height={size} />
}

export function ShareIcon({ className, size = 16 }: IconProps) {
  return <Share className={className} width={size} height={size} />
}

export function EyeIcon({ className, size = 16 }: IconProps) {
  return <Eye className={className} width={size} height={size} />
}

export function EyeOffIcon({ className, size = 16 }: IconProps) {
  return <EyeOff className={className} width={size} height={size} />
}

export function UsersIcon({ className, size = 16 }: IconProps) {
  return <Users className={className} width={size} height={size} />
}
