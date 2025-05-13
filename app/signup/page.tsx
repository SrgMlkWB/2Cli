"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    reason: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 1) {
      setStep(2)
      return
    }

    setIsLoading(true)

    // Simulate signup process
    setTimeout(() => {
      setIsLoading(false)
      router.push("/pending-approval")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader>
          <div className="flex items-center mb-2">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 text-zinc-400 hover:text-white hover:bg-zinc-800"
              onClick={() => (step === 1 ? router.push("/") : setStep(1))}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl text-white">{step === 1 ? "Create an Account" : "Request Access"}</CardTitle>
          </div>
          <CardDescription className="text-zinc-400">
            {step === 1 ? "Fill in your details to create a new account" : "Tell us why you want to join GamErz"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-zinc-300">
                    Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="Choose a username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-zinc-300">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-zinc-300">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="reason" className="text-zinc-300">
                  Why do you want to join GamErz?
                </Label>
                <Textarea
                  id="reason"
                  name="reason"
                  placeholder="Tell us about yourself and why you want to join our community..."
                  required
                  value={formData.reason}
                  onChange={handleChange}
                  className="bg-zinc-800 border-zinc-700 text-white min-h-[120px]"
                />
                <p className="text-xs text-zinc-500">
                  Your request will be reviewed by an administrator. This helps us maintain a positive community.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={isLoading}>
              {step === 1 ? "Continue" : isLoading ? "Submitting..." : "Submit Request"}
            </Button>
            {step === 1 && (
              <p className="text-sm text-zinc-400 text-center">
                Already have an account?{" "}
                <Link href="/login" className="text-red-500 hover:text-red-400">
                  Login
                </Link>
              </p>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

