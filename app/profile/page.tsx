"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { useTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function ProfilePage() {
  const { theme } = useTheme()
  const router = useRouter()
  const [profile, setProfile] = useState({
    username: "GamerPro99",
    email: "gamerpro99@example.com",
    bio: "Competitive FPS player, always looking for a challenge!",
    avatar: "/placeholder.svg?height=128&width=128",
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the updated profile to your backend
    console.log("Updated profile:", profile)
    setIsEditing(false)
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    })
  }

  return (
    <div className={cn("min-h-screen p-8", theme === "light" ? "bg-gray-50 text-gray-900" : "bg-black text-white")}>
      <div className="flex justify-between mb-4">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2" 
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft size={16} />
          Retour au dashboard
        </Button>
        <ThemeToggle />
      </div>

      <Card
        className={cn(
          "max-w-2xl mx-auto",
          theme === "light" ? "bg-white border-gray-200" : "bg-zinc-900 border-zinc-800",
        )}
      >
        <CardHeader>
          <CardTitle className={theme === "light" ? "text-gray-900" : "text-white"}>Your Profile</CardTitle>
          <CardDescription className={theme === "light" ? "text-gray-500" : "text-zinc-400"}>
            Manage your GamErz profile information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar} alt={profile.username} />
                  <AvatarFallback className={theme === "light" ? "bg-gray-200 text-gray-700" : "bg-red-500 text-white"}>
                    {profile.username.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  variant="outline"
                  className={theme === "light" ? "border-gray-200 text-gray-700" : "border-zinc-700 text-white"}
                >
                  Change Avatar
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className={theme === "light" ? "text-gray-700" : "text-white"}>
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={profile.username}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={cn(
                    theme === "light"
                      ? "bg-gray-100 border-gray-200 text-gray-900"
                      : "bg-zinc-800 border-zinc-700 text-white",
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className={theme === "light" ? "text-gray-700" : "text-white"}>
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={cn(
                    theme === "light"
                      ? "bg-gray-100 border-gray-200 text-gray-900"
                      : "bg-zinc-800 border-zinc-700 text-white",
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className={theme === "light" ? "text-gray-700" : "text-white"}>
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={cn(
                    theme === "light"
                      ? "bg-gray-100 border-gray-200 text-gray-900"
                      : "bg-zinc-800 border-zinc-700 text-white",
                  )}
                />
              </div>

              <div className="flex justify-end space-x-2">
                {isEditing ? (
                  <>
                    <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className={theme === "light" ? "border-gray-200 text-gray-700" : "border-zinc-700 text-white"}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

