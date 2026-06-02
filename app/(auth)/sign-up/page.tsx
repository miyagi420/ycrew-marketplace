"use client"

import { MainNav } from "@/components/navigation/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function SignUpForm() {
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get("role") || "crew"

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Your Account</CardTitle>
        <CardDescription>Join the CrewMatch community</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-3">
            <Label>I am a...</Label>
            <RadioGroup defaultValue={defaultRole}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="crew" id="crew" />
                <Label htmlFor="crew" className="font-normal cursor-pointer">
                  Crew Member (looking for work)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="owner" id="owner" />
                <Label htmlFor="owner" className="font-normal cursor-pointer">
                  Yacht Owner / Captain (hiring crew)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input id="confirm-password" type="password" required />
          </div>

          <div className="text-xs text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link href="/legal/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </div>

          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <div className="flex-1 flex items-center justify-center p-4">
        <Suspense fallback={<div>Loading...</div>}>
          <SignUpForm />
        </Suspense>
      </div>
    </div>
  )
}
