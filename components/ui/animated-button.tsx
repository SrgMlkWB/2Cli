"use client"

import type React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  theme: "light" | "dark"
  variant?: "default" | "outline" | "ghost"
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  className,
  theme,
  variant = "default",
  ...props
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "px-4 py-2 rounded-md font-medium transition-colors",
        variant === "default" && theme === "light" && "bg-red-500 text-white hover:bg-red-600",
        variant === "default" && theme === "dark" && "bg-red-600 text-white hover:bg-red-700",
        variant === "outline" && theme === "light" && "border border-red-500 text-red-500 hover:bg-red-50",
        variant === "outline" && theme === "dark" && "border border-red-500 text-red-500 hover:bg-red-950",
        variant === "ghost" && theme === "light" && "text-red-500 hover:bg-red-50",
        variant === "ghost" && theme === "dark" && "text-red-500 hover:bg-red-950",
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}

