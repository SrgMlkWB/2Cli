"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useTheme } from "@/contexts/theme-context";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeft } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const [settings, setSettings] = useState({
    notifications: true,
    language: "en",
  });

  const handleSwitchChange = (checked: boolean) => {
    setSettings((prev) => ({ ...prev, notifications: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "theme") {
      setTheme(value as "light" | "dark");
    } else {
      setSettings((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    console.log("Saved settings:", settings);
    toast({
      title: "Settings Saved",
      description: "Your settings have been successfully updated.",
    });
  };

  return (
    <div
      className={cn(
        "min-h-screen p-8",
        theme === "light" ? "bg-gray-50 text-gray-900" : "bg-black text-white"
      )}
    >
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "rounded-full",
            theme === "light" ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
          )}
          asChild
        >
          <Link href="/dashboard" title="Retour au dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <ThemeToggle />
      </div>

      <Card
        className={cn(
          "max-w-2xl mx-auto",
          theme === "light"
            ? "bg-white border-gray-200"
            : "bg-zinc-900 border-zinc-800"
        )}
      >
        <CardHeader>
          <CardTitle
            className={theme === "light" ? "text-gray-900" : "text-white"}
          >
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="notifications"
                className={cn(
                  "text-base",
                  theme === "light" ? "text-gray-700" : "text-white"
                )}
              >
                Notifications
              </Label>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={handleSwitchChange}
                className="data-[state=checked]:bg-red-500"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="theme"
                className={theme === "light" ? "text-gray-700" : "text-white"}
              >
                Theme
              </Label>
              <Select
                value={theme}
                onValueChange={(value) => handleSelectChange("theme", value)}
              >
                <SelectTrigger
                  id="theme"
                  className={cn(
                    theme === "light"
                      ? "bg-gray-100 border-gray-200 text-gray-900"
                      : "bg-zinc-800 border-zinc-700 text-white"
                  )}
                >
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent
                  className={
                    theme === "light"
                      ? "bg-white border-gray-200"
                      : "bg-zinc-800 border-zinc-700"
                  }
                >
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="language"
                className={theme === "light" ? "text-gray-700" : "text-white"}
              >
                Language
              </Label>
              <Select
                value={settings.language}
                onValueChange={(value) => handleSelectChange("language", value)}
              >
                <SelectTrigger
                  id="language"
                  className={cn(
                    theme === "light"
                      ? "bg-gray-100 border-gray-200 text-gray-900"
                      : "bg-zinc-800 border-zinc-700 text-white"
                  )}
                >
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent
                  className={
                    theme === "light"
                      ? "bg-white border-gray-200"
                      : "bg-zinc-800 border-zinc-700"
                  }
                >
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSave}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
