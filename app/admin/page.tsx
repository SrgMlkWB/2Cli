"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle, XCircle, Users, UserPlus, Clock, ArrowLeft, Shield } from "lucide-react"
import Link from "next/link"

// Mock data
const PENDING_REQUESTS = [
  {
    id: 1,
    username: "DragonSlayer42",
    email: "dragon@example.com",
    date: "2023-05-15",
    reason:
      "I've been gaming for over 10 years and would love to join a community of like-minded gamers. I mainly play RPGs and FPS games.",
  },
  {
    id: 2,
    username: "StarCraft_Queen",
    email: "starcraft@example.com",
    date: "2023-05-14",
    reason:
      "Looking for a community to discuss strategy games and maybe find some teammates for StarCraft tournaments.",
  },
  {
    id: 3,
    username: "MarioFan99",
    email: "mario@example.com",
    date: "2023-05-13",
    reason:
      "Huge Nintendo fan here! Would love to connect with other Nintendo enthusiasts and discuss the latest games.",
  },
]

const RECENT_USERS = [
  {
    id: 1,
    username: "CyberNinja",
    email: "cyber@example.com",
    date: "2023-05-10",
    status: "active",
  },
  {
    id: 2,
    username: "ElderScrollsFan",
    email: "elder@example.com",
    date: "2023-05-09",
    status: "active",
  },
  {
    id: 3,
    username: "RocketLeagueChamp",
    email: "rocket@example.com",
    date: "2023-05-08",
    status: "inactive",
  },
  {
    id: 4,
    username: "MinecraftBuilder",
    email: "minecraft@example.com",
    date: "2023-05-07",
    status: "active",
  },
  {
    id: 5,
    username: "FinalFantasyHero",
    email: "fantasy@example.com",
    date: "2023-05-06",
    status: "banned",
  },
]

export default function AdminPage() {
  const [pendingRequests, setPendingRequests] = useState(PENDING_REQUESTS)
  const [recentUsers, setRecentUsers] = useState(RECENT_USERS)

  const handleApprove = (id: number) => {
    setPendingRequests(pendingRequests.filter((request) => request.id !== id))
    // In a real app, you would also add the user to the approved users list
  }

  const handleReject = (id: number) => {
    setPendingRequests(pendingRequests.filter((request) => request.id !== id))
    // In a real app, you would notify the user that their request was rejected
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" className="mr-2 text-zinc-400 hover:text-white hover:bg-zinc-800" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-red-500 mr-2" />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-zinc-900 border-zinc-800 col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="mr-4 bg-blue-500/20 p-2 rounded-full">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Total Users</p>
                    <p className="text-xl font-bold">152</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 bg-yellow-500/20 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Pending Requests</p>
                    <p className="text-xl font-bold">{pendingRequests.length}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 bg-green-500/20 p-2 rounded-full">
                    <UserPlus className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">New Today</p>
                    <p className="text-xl font-bold">7</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 col-span-1 md:col-span-3">
            <Tabs defaultValue="pending" className="w-full">
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">User Management</CardTitle>
                  <TabsList className="bg-zinc-800">
                    <TabsTrigger value="pending" className="data-[state=active]:bg-red-500">
                      Pending
                    </TabsTrigger>
                    <TabsTrigger value="users" className="data-[state=active]:bg-red-500">
                      Users
                    </TabsTrigger>
                  </TabsList>
                </div>
                <CardDescription className="text-zinc-400">
                  Manage user access and review pending requests.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <TabsContent value="pending" className="m-0">
                  {pendingRequests.length === 0 ? (
                    <div className="text-center py-8 text-zinc-400">
                      <Clock className="h-12 w-12 mx-auto mb-3 text-zinc-500" />
                      <p>No pending requests</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[60vh]">
                      <div className="space-y-4">
                        {pendingRequests.map((request) => (
                          <Card key={request.id} className="bg-zinc-800 border-zinc-700">
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row md:items-start gap-4">
                                <Avatar className="h-12 w-12 border-2 border-zinc-700">
                                  <AvatarFallback className="bg-red-500 text-white">
                                    {request.username.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                    <div>
                                      <h3 className="font-medium text-white">{request.username}</h3>
                                      <p className="text-sm text-zinc-400">{request.email}</p>
                                    </div>
                                    <p className="text-xs text-zinc-500 mt-1 md:mt-0">Requested on {request.date}</p>
                                  </div>
                                  <div className="bg-zinc-900 p-3 rounded-md mb-3">
                                    <p className="text-sm text-zinc-300">{request.reason}</p>
                                  </div>
                                  <div className="flex justify-end space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                                      onClick={() => handleReject(request.id)}
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="bg-red-600 hover:bg-red-700 text-white"
                                      onClick={() => handleApprove(request.id)}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </TabsContent>
                <TabsContent value="users" className="m-0">
                  <ScrollArea className="h-[60vh]">
                    <div className="space-y-2">
                      {recentUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-3 rounded-md hover:bg-zinc-800 transition-colors"
                        >
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarFallback className="bg-zinc-700 text-zinc-300">
                                {user.username.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-white">{user.username}</p>
                              <p className="text-sm text-zinc-400">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Badge
                              className={
                                user.status === "active"
                                  ? "bg-green-500/20 text-green-500 hover:bg-green-500/30"
                                  : user.status === "inactive"
                                    ? "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
                                    : "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                              }
                            >
                              {user.status}
                            </Badge>
                            <Button variant="ghost" size="icon" className="ml-2 text-zinc-400 hover:text-white">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="19" cy="12" r="1" />
                                <circle cx="5" cy="12" r="1" />
                              </svg>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
}

