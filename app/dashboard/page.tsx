"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Hash,
  Menu,
  X,
  Users,
  Settings,
  LogOut,
  Send,
  Bell,
  User,
} from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { toast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { JoinRequestDialog } from "@/components/join-request-dialog";
import { useTheme } from "@/contexts/theme-context";

// Mock data
const SALONS = [
  {
    id: 1,
    name: "general",
    unread: true,
    description: "General discussion for all gamers",
    requiresApproval: false,
  },
  {
    id: 2,
    name: "minecraft",
    unread: false,
    description: "Minecraft building and survival",
    requiresApproval: true,
  },
  {
    id: 3,
    name: "fortnite",
    unread: false,
    description: "Fortnite battles and building",
    requiresApproval: true,
  },
];

// Liste des joueurs en ligne - ne contient que GamerPro99 par défaut
// Les autres joueurs seront ajoutés dynamiquement lorsqu'ils s'inscriront et se connecteront
const ONLINE_USERS = [
  {
    id: 1,
    name: "GamerPro99",
    status: "online",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Competitive FPS player, always looking for a challenge!",
  },
];

// Notifications factices pour l'exemple
const NOTIFICATIONS = [
  {
    id: 1,
    content: "Nouvelle demande d'ami de GamerX42",
    timestamp: "Il y a 5 minutes",
    read: false,
  },
  {
    id: 2,
    content: "Votre demande pour rejoindre le salon Minecraft a été acceptée",
    timestamp: "Il y a 2 heures",
    read: false,
  },
  {
    id: 3,
    content: "ProGamer99 vous a mentionné dans le salon general",
    timestamp: "Il y a 3 heures",
    read: true,
  },
  {
    id: 4,
    content: "Mise à jour de l'application disponible",
    timestamp: "Il y a 1 jour",
    read: true,
  },
  {
    id: 5,
    content: "Bienvenue sur Gamerz! Complétez votre profil",
    timestamp: "Il y a 3 jours",
    read: true,
  },
];

// Empty chat rooms - no default messages
const MESSAGES: Array<{
  id: number;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
  attachments: Array<{
    id: number;
    name: string;
    type: string;
    url: string;
  }>;
}> = [];

export default function DashboardPage() {
  const { theme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSalon, setActiveSalon] = useState(SALONS[0]);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState(MESSAGES);
  const [anonymousUsername, setAnonymousUsername] = useState("");
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [selectedSalonForJoin, setSelectedSalonForJoin] = useState<(typeof SALONS)[0] | null>(null);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [unreadNotifications, setUnreadNotifications] = useState(
    NOTIFICATIONS.filter((n) => !n.read).length
  );
  // Variables pour la gestion des modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState<any>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Check for stored username in localStorage
    const storedUsername = localStorage.getItem("anonymousUsername");
    if (storedUsername) {
      setAnonymousUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    if (isMobile || isTablet) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile, isTablet]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    const newMessage = {
      id: messages.length + 1,
      user: anonymousUsername || "You",
      avatar: "/placeholder.svg?height=40&width=40",
      content: messageInput,
      timestamp: "Just now",
      attachments: [],
    };
    setMessages([...messages, newMessage]);
    setMessageInput("");
  };

  const openJoinDialog = (salon: (typeof SALONS)[0]) => {
    // If the salon doesn't require approval, just join it
    if (!salon.requiresApproval) {
      toast({
        title: "Salon joined",
        description: `Vous avez rejoint le salon #${salon.name}.`,
      });
      setActiveSalon(salon);
      return;
    }
    
    // Otherwise, open the join request dialog
    setIsJoinDialogOpen(true);
    setSelectedSalonForJoin(salon);
  };

  const closeJoinDialog = () => {
    setIsJoinDialogOpen(false);
    setSelectedSalonForJoin(null);
  };

  const openModal = (type: "salon" | "user", item: any) => {
    setIsModalOpen(true);
    setModalItem(item);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalItem(null);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r transition-transform duration-300 ease-in-out",
          theme === "light"
            ? "bg-white border-gray-200"
            : "bg-black/50 backdrop-blur-md border-white/10",
          isMobile || isTablet
            ? sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div
          className={cn(
            "flex h-14 items-center justify-between px-4 border-b",
            theme === "light" ? "border-gray-200" : "border-white/10"
          )}
        >
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/GRond.png"
              alt="2GamerZ Logo"
              width={32}
              height={32}
              className="rounded-md"
            />
            <span
              className={cn(
                "text-lg font-bold",
                theme === "light" ? "text-gray-900" : "text-white"
              )}
            >
              2GamerZ
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              theme === "light"
                ? "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                : "text-white/70 hover:text-white hover:bg-white/10"
            )}
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Sidebar Content */}
        <ScrollArea className="flex-1">
          {/* Salons */}
          <div className="p-3">
            <h2
              className={cn(
                "mb-2 px-2 text-lg font-semibold tracking-tight",
                theme === "light" ? "text-gray-900" : "text-white"
              )}
            >
              Salons
            </h2>
            <div className="space-y-1">
              {SALONS.map((salon) => (
                <Button
                  key={salon.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    activeSalon.id === salon.id
                      ? theme === "light"
                        ? "bg-gray-100 text-gray-900"
                        : "bg-white/10 text-white"
                      : theme === "light"
                      ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      : "text-white/70 hover:text-white hover:bg-white/10",
                    salon.unread &&
                      activeSalon.id !== salon.id &&
                      "font-medium"
                  )}
                  onClick={() => {
                    if (activeSalon.id !== salon.id) {
                      openJoinDialog(salon);
                    }
                  }}
                >
                  <Hash className="mr-2 h-4 w-4" />
                  {salon.name}
                  {salon.unread && activeSalon.id !== salon.id && (
                    <div
                      className={cn(
                        "ml-auto h-2 w-2 rounded-full",
                        theme === "light" ? "bg-red-500" : "bg-red-400"
                      )}
                    />
                  )}
                </Button>
              ))}
            </div>
          </div>

          <Separator
            className={cn(
              "my-2",
              theme === "light" ? "bg-gray-200" : "bg-white/10"
            )}
          />

          {/* Online Users */}
          <div className="p-3">
            <h2
              className={cn(
                "mb-2 px-2 text-lg font-semibold tracking-tight",
                theme === "light" ? "text-gray-900" : "text-white"
              )}
            >
              Online Users
            </h2>
            <div className="space-y-1">
              {ONLINE_USERS.map((user) => (
                <Button
                  key={user.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    theme === "light"
                      ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                  onClick={() => openModal("user", user)}
                >
                  <div className="relative mr-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "absolute bottom-0 right-0 h-2 w-2 rounded-full border",
                        theme === "light"
                          ? "border-white bg-green-500"
                          : "border-black/50 bg-green-400"
                      )}
                    />
                  </div>
                  {user.name}
                </Button>
              ))}
            </div>
          </div>
        </ScrollArea>

        {/* Sidebar Footer */}
        <div
          className={cn(
            "flex h-14 items-center justify-between px-4 border-t",
            theme === "light" ? "border-gray-200" : "border-white/10"
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              theme === "light"
                ? "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                : "text-white/70 hover:text-white hover:bg-white/10"
            )}
            ref={notificationButtonRef}
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) {
                const updatedNotifications = notifications.map((n) => ({
                  ...n,
                  read: true,
                }));
                setNotifications(updatedNotifications);
                setUnreadNotifications(0);
              }
            }}
          >
            <div className="relative">
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <div
                  className={cn(
                    "absolute -top-1 -right-1 h-4 w-4 rounded-full text-[10px] font-medium flex items-center justify-center",
                    theme === "light"
                      ? "bg-red-500 text-white"
                      : "bg-red-400 text-black"
                  )}
                >
                  {unreadNotifications}
                </div>
              )}
            </div>
          </Button>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              theme === "light"
                ? "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                : "text-white/70 hover:text-white hover:bg-white/10"
            )}
            asChild
          >
            <Link href="/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              theme === "light"
                ? "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                : "text-white/70 hover:text-white hover:bg-white/10"
            )}
            asChild
          >
            <Link href="/login">
              <LogOut className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div
            ref={notificationsRef}
            className={cn(
              "absolute bottom-14 left-0 w-64 max-h-96 overflow-auto border rounded-md shadow-lg z-50",
              theme === "light"
                ? "bg-white border-gray-200"
                : "bg-black/90 border-white/10"
            )}
          >
            <div
              className={cn(
                "p-2 border-b",
                theme === "light" ? "border-gray-200" : "border-white/10"
              )}
            >
              <h3
                className={cn(
                  "font-medium",
                  theme === "light" ? "text-gray-900" : "text-white"
                )}
              >
                Notifications
              </h3>
            </div>
            <div className="p-2">
              {notifications.length === 0 ? (
                <p
                  className={cn(
                    "text-sm p-2 text-center",
                    theme === "light" ? "text-gray-500" : "text-white/50"
                  )}
                >
                  No notifications
                </p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-2 mb-1 rounded-md text-sm",
                      notification.read
                        ? theme === "light"
                          ? "bg-white"
                          : "bg-transparent"
                        : theme === "light"
                        ? "bg-gray-100"
                        : "bg-white/5",
                      theme === "light"
                        ? "text-gray-900 hover:bg-gray-100"
                        : "text-white hover:bg-white/10"
                    )}
                  >
                    <p>{notification.content}</p>
                    <p
                      className={cn(
                        "text-xs mt-1",
                        theme === "light" ? "text-gray-500" : "text-white/50"
                      )}
                    >
                      {notification.timestamp}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sidebar Toggle */}
      {(isMobile || isTablet) && !sidebarOpen && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "fixed top-3 left-3 z-50",
            theme === "light"
              ? "bg-white text-gray-900 border border-gray-200 shadow-sm"
              : "bg-black/50 backdrop-blur-md text-white border border-white/10"
          )}
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Main Content */}
      <div
        className={cn(
          "flex flex-col flex-1 h-full",
          (isMobile || isTablet) && sidebarOpen ? "opacity-50" : "opacity-100",
          sidebarOpen ? "ml-64" : "ml-0"
        )}
      >
        {/* Main Header */}
        <div
          className={cn(
            "flex h-14 items-center justify-between px-4 border-b",
            theme === "light" ? "bg-white border-gray-200" : "bg-black/50 backdrop-blur-md border-white/10"
          )}
        >
          <div className="flex items-center">
            <h1
              className={cn(
                "text-lg font-semibold",
                theme === "light" ? "text-gray-900" : "text-white"
              )}
            >
              #{activeSalon.name}
            </h1>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "ml-2",
                theme === "light"
                  ? "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
              onClick={() => openModal("salon", activeSalon)}
            >
              <Users className="h-4 w-4 mr-1" />
              <span className="text-xs">
                {ONLINE_USERS.length} online
              </span>
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            {anonymousUsername ? (
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage
                    src="/placeholder.svg?height=32&width=32"
                    alt={anonymousUsername}
                  />
                  <AvatarFallback>
                    {anonymousUsername.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={cn(
                    "text-sm font-medium",
                    theme === "light" ? "text-gray-900" : "text-white"
                  )}
                >
                  {anonymousUsername}
                </span>
              </div>
            ) : (
              <Input
                type="text"
                placeholder="Set username"
                className={cn(
                  "h-8 w-40",
                  theme === "light"
                    ? "bg-gray-100 border-gray-200"
                    : "bg-white/5 border-white/10"
                )}
                value={anonymousUsername}
                onChange={(e) => {
                  setAnonymousUsername(e.target.value);
                  localStorage.setItem("anonymousUsername", e.target.value);
                }}
              />
            )}
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1">
            <div className="p-3">
              {messages.length === 0 ? (
                <div
                  className={cn(
                    "flex flex-col items-center justify-center h-64",
                    theme === "light" ? "text-gray-500" : "text-white/50"
                  )}
                >
                  <Hash className="h-12 w-12 mb-4 opacity-20" />
                  <p className="text-lg font-medium">Welcome to #{activeSalon.name}</p>
                  <p className="text-sm">
                    This is the start of the #{activeSalon.name} channel
                  </p>
                  <p className="text-xs mt-4 max-w-md text-center">
                    {activeSalon.description}
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex mb-4 group",
                      message.user === (anonymousUsername || "You")
                        ? "justify-end"
                        : "justify-start"
                    )}
                  >
                    {message.user !== (anonymousUsername || "You") && (
                      <Avatar className="h-8 w-8 mr-2 mt-1">
                        <AvatarImage src={message.avatar} alt={message.user} />
                        <AvatarFallback>
                          {message.user.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "flex flex-col max-w-[80%]",
                        message.user === (anonymousUsername || "You")
                          ? "items-end"
                          : "items-start"
                      )}
                    >
                      <div className="flex items-center mb-1">
                        {message.user !== (anonymousUsername || "You") && (
                          <span
                            className={cn(
                              "text-sm font-medium mr-2",
                              theme === "light"
                                ? "text-gray-900"
                                : "text-white"
                            )}
                          >
                            {message.user}
                          </span>
                        )}
                        <span
                          className={cn(
                            "text-xs",
                            theme === "light"
                              ? "text-gray-500"
                              : "text-white/50"
                          )}
                        >
                          {message.timestamp}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "p-3 rounded-lg",
                          message.user === (anonymousUsername || "You")
                            ? theme === "light"
                              ? "bg-blue-500 text-white"
                              : "bg-blue-600 text-white"
                            : theme === "light"
                            ? "bg-gray-100 text-gray-900"
                            : "bg-white/10 text-white"
                        )}
                      >
                        {message.content}
                      </div>
                    </div>
                    {message.user === (anonymousUsername || "You") && (
                      <Avatar className="h-8 w-8 ml-2 mt-1">
                        <AvatarImage src={message.avatar} alt={message.user} />
                        <AvatarFallback>
                          {message.user.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div
            className={cn(
              "p-3 border-t",
              theme === "light"
                ? "bg-white border-gray-200"
                : "bg-black/50 border-white/10",
              "backdrop-blur-sm"
            )}
          >
            <form onSubmit={handleSendMessage} className="flex items-center">
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={`Message #${activeSalon.name}`}
                className={cn(
                  "flex-1 mx-2 focus-visible:ring-red-500",
                  theme === "light"
                    ? "bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-500"
                    : "bg-white/5 border-white/10 text-white placeholder:text-white/50"
                )}
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className={cn(
                  theme === "light"
                    ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
                disabled={!messageInput.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Dialog pour la demande d'adhésion */}
      <JoinRequestDialog 
        isOpen={isJoinDialogOpen} 
        onClose={closeJoinDialog} 
        salon={selectedSalonForJoin}
      />
    </div>
  );
}
