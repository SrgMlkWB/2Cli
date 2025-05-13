"use client"

import { useTheme } from "@/contexts/theme-context"
import { Switch } from "@/components/ui/switch"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} className="data-[state=checked]:bg-red-500" />
      {theme === "light" ? <Sun className="h-4 w-4 text-gray-700" /> : <Moon className="h-4 w-4 text-gray-300" />}
    </div>
  )
}

