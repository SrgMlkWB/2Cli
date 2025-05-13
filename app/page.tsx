"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, MessageSquare, Users, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  const [username, setUsername] = useState("")
  const router = useRouter()
  const { theme } = useTheme()

  const handleSkip = () => {
    router.push("/dashboard")
  }

  const handleAnonymousLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      // In a real app, you'd want to store this username in a more persistent way
      localStorage.setItem("anonymousUsername", username)
      router.push("/dashboard")
    }
  }

  return (
    <div
      className={cn(
        "min-h-screen overflow-hidden",
        theme === "light"
          ? "bg-gradient-to-br from-gray-100 via-red-50 to-gray-100 text-gray-900"
          : "bg-gradient-to-br from-black via-red-900 to-black text-white",
      )}
    >
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Welcome to <span className="text-red-500">GamErz</span>
          </h1>
          <p className={cn("text-xl md:text-2xl mb-12 max-w-2xl", theme === "light" ? "text-gray-700" : "text-white")}>
            Connect, chat, and game with fellow enthusiasts in real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button asChild className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg">
              <Link href="/login">
                Login <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className={cn(
                "border-red-500 text-red-500 px-8 py-3 text-lg",
                theme === "light" ? "hover:bg-red-50" : "hover:bg-red-950",
              )}
            >
              <Link href="/signup">
                Sign Up <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="w-full max-w-md">
            <form onSubmit={handleAnonymousLogin} className="flex flex-col gap-4">
              <Input
                type="text"
                placeholder="Enter a username to join anonymously"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={cn(
                  theme === "light"
                    ? "bg-white/70 border-gray-200 text-gray-900 placeholder:text-gray-500"
                    : "bg-white/10 border-white/20 text-white placeholder:text-white/50",
                )}
              />
              <Button
                type="submit"
                className={
                  theme === "light"
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-white text-red-600 hover:bg-red-100"
                }
              >
                Join Anonymously
              </Button>
            </form>
          </div>
          <Button
            variant="ghost"
            onClick={handleSkip}
            className={cn(
              "mt-4",
              theme === "light"
                ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
                : "text-white/70 hover:text-white hover:bg-white/10",
            )}
          >
            Skip and explore
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <FeatureCard
            icon={<MessageSquare className={theme === "light" ? "h-12 w-12 text-red-500" : "h-12 w-12 text-red-500"} />}
            title="Real-time Chat"
            description="Connect with other gamers in topic-based salons with instant messaging."
            theme={theme}
          />
          <FeatureCard
            icon={<Users className={theme === "light" ? "h-12 w-12 text-red-500" : "h-12 w-12 text-red-500"} />}
            title="Community"
            description="Join a vibrant community of like-minded gamers from around the world."
            theme={theme}
          />
          <FeatureCard
            icon={<Settings className={theme === "light" ? "h-12 w-12 text-red-500" : "h-12 w-12 text-red-500"} />}
            title="Customizable Experience"
            description="Tailor your gaming environment to suit your preferences."
            theme={theme}
          />
        </motion.div>
      </div>

      {/* Background Animation */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -inset-[10px] opacity-50"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23FF0000' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
          animate={{
            x: [0, -20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 20,
            ease: "linear",
          }}
        />
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  theme,
}: {
  icon: React.ReactNode
  title: string
  description: string
  theme: "light" | "dark"
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={cn(
        "p-6 rounded-lg border transition-all duration-300 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20",
        theme === "light" ? "bg-white/80 border-gray-200" : "bg-white/5 border-white/10",
      )}
    >
      <div className="mb-4">{icon}</div>
      <h3 className={cn("text-xl font-bold mb-2", theme === "light" ? "text-gray-900" : "text-white")}>{title}</h3>
      <p className={theme === "light" ? "text-gray-600" : "text-white/70"}>{description}</p>
    </motion.div>
  )
}

