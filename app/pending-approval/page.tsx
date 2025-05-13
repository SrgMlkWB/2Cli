import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, ArrowLeft } from "lucide-react"

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-yellow-500/20 p-3">
              <Clock className="h-12 w-12 text-yellow-500" />
            </div>
          </div>
          <CardTitle className="text-2xl text-white">Request Pending</CardTitle>
          <CardDescription className="text-zinc-400">Your request to join GamErz is being reviewed</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-zinc-300 mb-4">Thank you for your interest in joining our community!</p>
          <p className="text-zinc-400 mb-4">
            An administrator will review your request shortly. You&apos;ll receive an email notification once your
            request has been processed.
          </p>
          <div className="bg-zinc-800 rounded-lg p-4 mb-4">
            <p className="text-sm text-zinc-400">
              <span className="font-semibold text-zinc-300">Typical response time:</span> 24-48 hours
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button asChild variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

