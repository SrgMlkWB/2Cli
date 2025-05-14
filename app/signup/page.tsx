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
import { registerUser } from "@/lib/api"
import { toast } from "sonner"

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
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 1) {
      // Vérifier que les mots de passe correspondent
      if (formData.password !== formData.confirmPassword) {
        setError("Les mots de passe ne correspondent pas")
        return
      }
      setStep(2)
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Envoyer les données d'inscription à l'API
      await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        motivation: formData.reason
      })
      
      // Rediriger vers la page d'attente d'approbation
      router.push("/pending-approval")
      toast.success("Inscription réussie! Votre demande est en attente d'approbation.")
    } catch (error: any) {
      setIsLoading(false)
      setError(error.message || "Une erreur est survenue lors de l'inscription")
      toast.error("Erreur d'inscription: " + error.message)
    }
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
            <CardTitle className="text-2xl text-white">{step === 1 ? "Créer un compte" : "Demande d'accès"}</CardTitle>
          </div>
          <CardDescription className="text-zinc-400">
            {step === 1 ? "Remplissez vos coordonnées pour créer un nouveau compte" : "Dites-nous pourquoi vous voulez rejoindre GamErz"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-zinc-300">
                    Nom d'utilisateur
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="Choisissez un nom d'utilisateur"
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
                    placeholder="votre.email@exemple.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-zinc-300">
                    Mot de passe
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
                    Confirmer le mot de passe
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
                  Pourquoi voulez-vous rejoindre GamErz?
                </Label>
                <Textarea
                  id="reason"
                  name="reason"
                  placeholder="Parlez-nous de vous et pourquoi vous voulez rejoindre notre communauté..."
                  required
                  value={formData.reason}
                  onChange={handleChange}
                  className="bg-zinc-800 border-zinc-700 text-white min-h-[120px]"
                />
                <p className="text-xs text-zinc-500">
                  Votre demande sera examinée par un administrateur. Cela nous aide à maintenir une communauté positive.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={isLoading}>
              {step === 1 ? "Continuer" : isLoading ? "Soumission en cours..." : "Soumettre la demande"}
            </Button>
            {step === 1 && (
              <p className="text-sm text-zinc-400 text-center">
                Vous avez déjà un compte?{" "}
                <Link href="/login" className="text-red-500 hover:text-red-400">
                  Connexion
                </Link>
              </p>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

