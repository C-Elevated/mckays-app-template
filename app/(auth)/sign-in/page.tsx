"use client"

import { createClient } from "@/components/utilities/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MailIcon, LockIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignIn() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        toast.error(error.message)
      } else if (data?.user) {
        toast.success("Signed in successfully!")
        router.push("/protected/dashboard")
        router.refresh()
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: "google" | "azure") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${location.origin}/auth/callback`
        }
      })

      if (error) {
        toast.error(error.message)
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-center">Sign In</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <MailIcon className="text-muted-foreground absolute left-2 top-2.5 size-4" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="pl-8"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <LockIcon className="text-muted-foreground absolute left-2 top-2.5 size-4" />
              <Input
                id="password"
                type="password"
                className="pl-8"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in with Email"}
          </Button>
        </form>

        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link href="/sign-up" className="underline">
            Sign up
          </Link>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn("google")}
            className="space-x-2"
          >
            <svg className="size-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Google</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn("azure")}
            className="space-x-2"
          >
            <svg className="size-4" viewBox="0 0 23 23">
              <path fill="#00A4EF" d="M0 0h10.931v10.931H0z" />
              <path fill="#7FBA00" d="M12.069 0H23v10.931H12.069z" />
              <path fill="#FFB900" d="M0 12.069h10.931V23H0z" />
              <path fill="#F25022" d="M12.069 12.069H23V23H12.069z" />
            </svg>
            <span>Microsoft</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
