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
  File,
  Image as ImageIcon,
  Paperclip,
  User,
  BarChart3,
  Activity,
  Trophy,
  Calendar,
  Target,
  UserPlus,
} from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { toast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { JoinRequestDialog } from "@/components/join-request-dialog";
import { useTheme } from "@/contexts/theme-context";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

// Messages - Adaptés pour n'avoir que GamerPro99 comme utilisateur actif
const MESSAGES = [
  {
    id: 1,
    user: "GamerPro99",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Hey everyone! Has anyone tried the new Valorant update?",
    timestamp: "Today at 10:23 AM",
    attachments: [],
  },
  {
    id: 2,
    user: "GamerPro99",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "The new map is amazing! So many strategic spots for ambushes.",
    timestamp: "Today at 10:32 AM",
    attachments: [
      {
        id: 1,
        name: "map-screenshot.jpg",
        type: "image",
        url: "/placeholder.svg?height=300&width=400",
      },
    ],
  },
  {
    id: 3,
    user: "GamerPro99",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Anyone want to team up for some ranked matches later?",
    timestamp: "Today at 10:35 AM",
    attachments: [{ id: 2, name: "team-schedule.pdf", type: "file", url: "#" }],
  },
];

// Mock data for charts
const ACTIVITY_DATA = [
  { name: "Mon", hours: 2.5 },
  { name: "Tue", hours: 3.8 },
  { name: "Wed", hours: 5.2 },
  { name: "Thu", hours: 4.3 },
  { name: "Fri", hours: 6.7 },
  { name: "Sat", hours: 8.1 },
  { name: "Sun", hours: 7.2 },
];

const GAME_DISTRIBUTION = [
  { name: "Valorant", value: 35 },
  { name: "Minecraft", value: 20 },
  { name: "Apex Legends", value: 25 },
  { name: "Fortnite", value: 15 },
  { name: "League of Legends", value: 5 },
];

const PERFORMANCE_DATA = [
  { name: "Jan", wins: 15, losses: 10 },
  { name: "Feb", wins: 20, losses: 8 },
  { name: "Mar", wins: 18, losses: 12 },
  { name: "Apr", wins: 25, losses: 7 },
  { name: "May", wins: 22, losses: 9 },
  { name: "Jun", wins: 30, losses: 5 },
];

const LEADERBOARD_DATA = [
  { rank: 1, name: "NinjaWarrior", score: 9850, winRate: "78%" },
  { rank: 2, name: "FragMaster", score: 9720, winRate: "75%" },
  { rank: 3, name: "SniperElite", score: 9540, winRate: "72%" },
  { rank: 4, name: "GamerPro99", score: 9350, winRate: "70%" },
  { rank: 5, name: "RespawnHero", score: 9120, winRate: "68%" },
];

const UPCOMING_EVENTS = [
  { id: 1, name: "Valorant Tournament", date: "2023-06-15", participants: 32 },
  {
    id: 2,
    name: "Minecraft Building Contest",
    date: "2023-06-20",
    participants: 24,
  },
  {
    id: 3,
    name: "Apex Legends Squad Challenge",
    date: "2023-06-25",
    participants: 48,
  },
];

const COLORS = ["#FF4560", "#00E396", "#775DD0", "#FEB019", "#4CAF50"];

export default function DashboardPage() {
  const { theme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSalon, setActiveSalon] = useState(SALONS[0]);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState(MESSAGES);
  const [fileUploads, setFileUploads] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  // État pour la demande d'adhésion
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [selectedSalonForJoin, setSelectedSalonForJoin] = useState<(typeof SALONS)[0] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [anonymousUsername, setAnonymousUsername] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"chat" | "stats">("chat");
  
  // État pour stocker les utilisateurs en ligne (initialisé avec ONLINE_USERS)
  // Seul GamerPro99 est présent par défaut, les autres utilisateurs seront ajoutés dynamiquement
  const [onlineUsers, setOnlineUsers] = useState(ONLINE_USERS);
  const [unreadNotifications, setUnreadNotifications] = useState(
    NOTIFICATIONS.filter((n) => !n.read).length
  );
  // Variables pour la gestion des modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"salon" | "user">("salon");
  const [modalItem, setModalItem] = useState<any>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    if (!messageInput.trim() && fileUploads.length === 0) return;

    const attachments = fileUploads.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      type: file.type.startsWith("image/") ? "image" : "file",
      url: URL.createObjectURL(file),
    }));

    const newMessage = {
      id: messages.length + 1,
      user: anonymousUsername || "You",
      avatar: "/placeholder.svg?height=40&width=40",
      content: messageInput,
      timestamp: "Just now",
      attachments,
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");
    setFileUploads([]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setFileUploads([...fileUploads, ...filesArray]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      setFileUploads([...fileUploads, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...fileUploads];
    newFiles.splice(index, 1);
    setFileUploads(newFiles);
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const openJoinDialog = (salon: (typeof SALONS)[0]) => {
    // Si le salon ne nécessite pas d'approbation, rejoindre directement
    if (!salon.requiresApproval) {
      toast({
        title: "Salon rejoint",
        description: `Vous avez rejoint le salon #${salon.name}.`,
      });
      setActiveSalon(salon);
      setActiveView("chat");
      return;
    }
    
    // Sinon, ouvrir le dialogue de demande d'adhésion
    setSelectedSalonForJoin(salon);
    setIsJoinDialogOpen(true);
  };

  const closeJoinDialog = () => {
    setIsJoinDialogOpen(false);
    setSelectedSalonForJoin(null);
  };

  const openModal = (type: "salon" | "user", item: any) => {
    setIsModalOpen(true);
    setModalType(type);
    setModalItem(item);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("salon");
    setModalItem(null);
  };

  return (
    <div
      className={cn(
        "h-screen flex overflow-hidden font-sans",
        theme === "light"
          ? "bg-gray-50 text-gray-900"
          : "bg-gradient-to-br from-black via-red-900 to-black text-white"
      )}
    >
      {/* Sidebar */}
      <div
        className={cn(
          "backdrop-blur-xl w-64 flex-shrink-0 flex flex-col border-r transition-all duration-300 ease-in-out z-20",
          theme === "light"
            ? "bg-white border-gray-200"
            : "bg-black/50 border-white/10",
          (isMobile || isTablet) && !sidebarOpen ? "w-0" : "w-full md:w-64"
        )}
      >
        {sidebarOpen && (
          <>
            <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-white/10">
              <div className="flex items-center space-x-2">
                <Link
                  href="/dashboard"
                  className="relative group"
                >
                  <div className="w-8 h-8 transition-transform duration-300 transform group-hover:scale-125">
                    <Image 
                      src="/GRond.png" 
                      alt="Logo Gamerz" 
                      width={32} 
                      height={32} 
                      className="object-contain"
                    />
                  </div>
                </Link>
                <Link
                  href="/home"
                  className={cn(
                    "text-xl font-bold hover:text-red-500 transition-colors",
                    theme === "light" ? "text-gray-900" : "text-white"
                  )}
                >
                  <span className="text-red-500">GamErz</span>
                </Link>
              </div>
              <ThemeToggle />
              {(isMobile || isTablet) && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    theme === "light"
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-white hover:bg-white/10"
                  )}
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>

            <div className="p-3 flex space-x-1">
              <Button
                variant={activeView === "chat" ? "default" : "outline"}
                className={cn(
                  "flex-1",
                  theme === "light"
                    ? "bg-gray-100 text-gray-900 hover:bg-gray-200 border-gray-200"
                    : "bg-white/10 text-white hover:bg-white/20 border-white/20"
                )}
                onClick={() => setActiveView("chat")}
              >
                <Hash className="h-4 w-4 mr-2" />
                Chat
              </Button>
              <Button
                variant={activeView === "stats" ? "default" : "outline"}
                className={cn(
                  "flex-1",
                  theme === "light"
                    ? "bg-gray-100 text-gray-900 hover:bg-gray-200 border-gray-200"
                    : "bg-white/10 text-white hover:bg-white/20 border-white/20"
                )}
                onClick={() => setActiveView("stats")}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Stats
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-3">
                <h2
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wider mb-2",
                    theme === "light" ? "text-gray-700" : "text-white/70"
                  )}
                >
                  Salons
                </h2>
                <div className="space-y-1">
                  {SALONS.map((salon) => (
                    <div key={salon.id} className="flex items-center space-x-1 mb-1">
                      <Button
                        variant="ghost"
                        className={cn(
                          "flex-1 justify-start",
                          theme === "light"
                            ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                            : "text-white/70 hover:text-white hover:bg-white/10",
                          activeSalon.id === salon.id &&
                            (theme === "light"
                              ? "bg-gray-100 text-gray-900"
                              : "bg-white/20 text-white")
                        )}
                        onClick={() => {
                          setActiveSalon(salon);
                          setActiveView("chat");
                        }}
                      >
                        <Hash className="mr-2 h-4 w-4" />
                        <span className="truncate">{salon.name}</span>
                        {salon.unread && (
                          <span className="ml-auto flex h-2 w-2 rounded-full bg-red-500" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "flex-shrink-0",
                          theme === "light"
                            ? "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                            : "text-white/50 hover:text-white hover:bg-white/10"
                        )}
                        onClick={() => openJoinDialog(salon)}
                        title={salon.requiresApproval ? "Demander à rejoindre ce salon" : "Rejoindre ce salon"}
                      >
                        {salon.requiresApproval ? <UserPlus className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Separator
                className={cn(
                  "my-3",
                  theme === "light" ? "bg-gray-200" : "bg-white/10"
                )}
              />

              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h2
                    className={cn(
                      "text-xs font-semibold uppercase tracking-wider",
                      theme === "light" ? "text-gray-700" : "text-white/70"
                    )}
                  >
                    Online Users
                  </h2>
                  <span
                    className={cn(
                      "text-xs",
                      theme === "light" ? "text-gray-500" : "text-white/50"
                    )}
                  >
                    {onlineUsers.length}
                  </span>
                </div>
                <div className="space-y-1">
                  {onlineUsers.map((user) => (
                    <Button
                      key={user.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start",
                        theme === "light"
                          ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      )}
                      onClick={() => openModal("user", user)}
                    >
                      <div className="relative mr-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback
                            className={cn(
                              theme === "light"
                                ? "bg-gray-200 text-gray-700"
                                : "bg-zinc-700 text-zinc-300"
                            )}
                          >
                            {user.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className={cn(
                            "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2",
                            theme === "light" ? "border-white" : "border-black",
                            user.status === "online" && "bg-green-500",
                            user.status === "idle" && "bg-yellow-500",
                            user.status === "dnd" && "bg-red-500"
                          )}
                        />
                      </div>
                      <span className="text-sm truncate">{user.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </ScrollArea>

            <div
              className={cn(
                "p-3 border-t",
                theme === "light" ? "border-gray-200" : "border-white/10"
              )}
            >
              <div className="flex items-center">
                <Avatar className="h-9 w-9 mr-2">
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt="Your Avatar"
                  />
                  <AvatarFallback className="bg-red-500 text-white">
                    {anonymousUsername
                      ? anonymousUsername.substring(0, 2).toUpperCase()
                      : "AN"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium truncate",
                      theme === "light" ? "text-gray-900" : "text-white"
                    )}
                  >
                    {anonymousUsername || "Anonymous User"}
                  </p>
                  <p
                    className={cn(
                      "text-xs truncate",
                      theme === "light" ? "text-gray-500" : "text-white/50"
                    )}
                  >
                    Online
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    theme === "light"
                      ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                  asChild
                >
                  <Link href="/profile">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    theme === "light"
                      ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
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
                      ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 flex flex-col overflow-hidden",
          theme === "light" ? "bg-gray-50" : "bg-black/30",
          "backdrop-blur-sm"
        )}
      >
        {/* Header */}
        <header
          className={cn(
            "h-14 flex items-center px-4 border-b",
            theme === "light"
              ? "bg-white border-gray-200"
              : "bg-black/50 border-white/10",
            "backdrop-blur-md"
          )}
        >
          {(isMobile || isTablet) && !sidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className={cn(
                "mr-2",
                theme === "light"
                  ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center">
            {activeView === "chat" ? (
              <>
                <Hash
                  className={cn(
                    "h-5 w-5 mr-2",
                    theme === "light" ? "text-gray-500" : "text-white/70"
                  )}
                />
                <h2
                  className={
                    theme === "light"
                      ? "text-gray-900 font-medium"
                      : "text-white font-medium"
                  }
                >
                  {activeSalon.name}
                </h2>
              </>
            ) : (
              <>
                <BarChart3
                  className={cn(
                    "h-5 w-5 mr-2",
                    theme === "light" ? "text-gray-500" : "text-white/70"
                  )}
                />
                <h2
                  className={
                    theme === "light"
                      ? "text-gray-900 font-medium"
                      : "text-white font-medium"
                  }
                >
                  Gaming Statistics
                </h2>
              </>
            )}
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <div className="relative">
              <Button
                ref={notificationButtonRef}
                variant="ghost"
                size="icon"
                className={cn(
                  "p-2", // Augmenter le padding pour accommoder l'icône plus grande
                  theme === "light"
                    ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-10 w-10" /> {/* Icône deux fois plus grande */}
                {NOTIFICATIONS.some(notif => !notif.read) && (
                  <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500" />
                )}
              </Button>
              
              {showNotifications && (
                <div 
                  ref={notificationsRef}
                  className={cn(
                    "fixed right-4 top-20 w-80 rounded-md shadow-lg z-[999999]", // Ajusté la position top pour l'icône plus grande
                    theme === "light" ? "bg-white border border-gray-200" : "bg-zinc-900 border border-zinc-800"
                  )}
                  style={{ 
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)", 
                    pointerEvents: "auto"
                  }}
                >
                  <div className={cn(
                    "p-3 border-b",
                    theme === "light" ? "border-gray-200" : "border-zinc-800"
                  )}>
                    <h3 className={cn(
                      "font-semibold",
                      theme === "light" ? "text-gray-900" : "text-white"
                    )}>
                      Notifications
                    </h3>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    <div className={cn(
                      "p-3 border-b",
                      theme === "light" ? "border-gray-200" : "border-zinc-800"
                    )}>
                      <h4 className={cn(
                        "text-sm font-medium mb-2",
                        theme === "light" ? "text-gray-700" : "text-zinc-300"
                      )}>
                        Récentes
                      </h4>
                      {NOTIFICATIONS.filter(notif => !notif.read).length > 0 ? (
                        <ul className="space-y-2">
                          {NOTIFICATIONS.filter(notif => !notif.read).map(notification => (
                            <li 
                              key={notification.id} 
                              className={cn(
                                "p-2 rounded-md flex items-start cursor-pointer",
                                theme === "light" ? "hover:bg-gray-100" : "hover:bg-zinc-800"
                              )}
                              onClick={() => {
                                // Marquer cette notification comme lue
                                const updatedNotifications = [...NOTIFICATIONS];
                                const index = updatedNotifications.findIndex(n => n.id === notification.id);
                                if (index !== -1) {
                                  updatedNotifications[index] = { ...updatedNotifications[index], read: true };
                                  // Dans une application réelle, vous enverriez cette mise à jour au serveur
                                  toast({
                                    title: "Notification lue",
                                    description: "La notification a été marquée comme lue.",
                                  });
                                }
                              }}
                            >
                              <div className="flex-1">
                                <p className={cn(
                                  "text-sm",
                                  theme === "light" ? "text-gray-800" : "text-white"
                                )}>
                                  {notification.content}
                                </p>
                                <p className={cn(
                                  "text-xs mt-1",
                                  theme === "light" ? "text-gray-500" : "text-zinc-400"
                                )}>
                                  {notification.timestamp}
                                </p>
                              </div>
                              <span className="h-2 w-2 mt-1 rounded-full bg-red-500 flex-shrink-0" />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className={cn(
                          "text-sm italic",
                          theme === "light" ? "text-gray-500" : "text-zinc-400"
                        )}>
                          Aucune notification récente
                        </p>
                      )}
                    </div>
                    
                    <div className="p-3">
                      <h4 className={cn(
                        "text-sm font-medium mb-2",
                        theme === "light" ? "text-gray-700" : "text-zinc-300"
                      )}>
                        Historique
                      </h4>
                      <ul className="space-y-2">
                        {NOTIFICATIONS.filter(notif => notif.read).map(notification => (
                          <li key={notification.id} className={cn(
                            "p-2 rounded-md",
                            theme === "light" ? "hover:bg-gray-100" : "hover:bg-zinc-800"
                          )}>
                            <p className={cn(
                              "text-sm",
                              theme === "light" ? "text-gray-800" : "text-white"
                            )}>
                              {notification.content}
                            </p>
                            <p className={cn(
                              "text-xs mt-1",
                              theme === "light" ? "text-gray-500" : "text-zinc-400"
                            )}>
                              {notification.timestamp}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className={cn(
                    "p-2 border-t flex justify-end",
                    theme === "light" ? "border-gray-200" : "border-zinc-800"
                  )}>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={cn(
                        "text-xs font-medium", // Ajout de font-medium pour meilleure visibilité
                        theme === "light" ? "text-gray-700 hover:bg-gray-100" : "text-zinc-300 hover:bg-zinc-800"
                      )}
                      onClick={() => {
                        // Marquer toutes les notifications comme lues
                        const updatedNotifications = NOTIFICATIONS.map(notif => ({
                          ...notif,
                          read: true
                        }));
                        // Dans une application réelle, vous enverriez cette mise à jour au serveur
                        setUnreadNotifications(0);
                        toast({
                          title: "Notifications",
                          description: "Toutes les notifications ont été marquées comme lues.",
                        });
                        setShowNotifications(false);
                      }}
                    >
                      Tout marquer comme lu
                    </Button>
                  </div>
                </div>
              )}
            </div>
            {/* Bouton de groupe commenté car inutile
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                theme === "light"
                  ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              <Users className="h-5 w-5" />
            </Button>
            */}
          </div>
        </header>

        {/* Content Area */}
        {activeView === "chat" ? (
          <>
            {/* Messages */}
            <ScrollArea
              className="flex-1 p-4"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex group">
                    <Avatar className="h-10 w-10 mr-3 mt-0.5 flex-shrink-0">
                      <AvatarImage src={message.avatar} alt={message.user} />
                      <AvatarFallback
                        className={cn(
                          theme === "light"
                            ? "bg-gray-200 text-gray-700"
                            : "bg-zinc-700 text-zinc-300"
                        )}
                      >
                        {message.user.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-1">
                        <span
                          className={cn(
                            "font-medium mr-2",
                            theme === "light" ? "text-gray-900" : "text-white"
                          )}
                        >
                          {message.user}
                        </span>
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
                      {message.content && (
                        <p
                          className={cn(
                            "mb-2",
                            theme === "light"
                              ? "text-gray-800"
                              : "text-white/90"
                          )}
                        >
                          {message.content}
                        </p>
                      )}

                      {/* File Attachments */}
                      {message.attachments &&
                        message.attachments.length > 0 && (
                          <div className="space-y-2 mt-2 relative z-[-1]">
                            {message.attachments.map((attachment) => (
                              <div
                                key={attachment.id}
                                className={cn(
                                  "rounded-md overflow-hidden border relative z-[-1]",
                                  theme === "light"
                                    ? "border-gray-200 bg-white"
                                    : "border-white/10 bg-white/5 backdrop-blur-sm"
                                )}
                              >
                                {attachment.type === "image" ? (
                                  <div className="relative">
                                    <img
                                      src={attachment.url || "/placeholder.svg"}
                                      alt={attachment.name}
                                      className="max-w-full max-h-80 object-contain"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-3 py-1.5 text-xs text-white">
                                      {attachment.name}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center p-3">
                                    <div
                                      className={cn(
                                        "p-2 rounded-md mr-3",
                                        theme === "light"
                                          ? "bg-gray-100"
                                          : "bg-white/10"
                                      )}
                                    >
                                      <File
                                        className={cn(
                                          "h-6 w-6",
                                          theme === "light"
                                            ? "text-gray-500"
                                            : "text-white/70"
                                        )}
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p
                                        className={cn(
                                          "text-sm font-medium truncate",
                                          theme === "light"
                                            ? "text-gray-900"
                                            : "text-white"
                                        )}
                                      >
                                        {attachment.name}
                                      </p>
                                      <p
                                        className={cn(
                                          "text-xs",
                                          theme === "light"
                                            ? "text-gray-500"
                                            : "text-white/50"
                                        )}
                                      >
                                        Click to download
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>

              {/* File Drop Overlay */}
              {isDragging && (
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center z-10 border-2 border-dashed border-red-500 rounded-md",
                    theme === "light" ? "bg-gray-100/80" : "bg-black/80",
                    "backdrop-blur-sm"
                  )}
                >
                  <div className="text-center p-6">
                    <Paperclip className="h-12 w-12 text-red-500 mx-auto mb-3" />
                    <p
                      className={cn(
                        "text-xl font-medium",
                        theme === "light" ? "text-gray-900" : "text-white"
                      )}
                    >
                      Drop files to upload
                    </p>
                  </div>
                </div>
              )}
            </ScrollArea>

            {/* File Preview Area */}
            {fileUploads.length > 0 && (
              <div
                className={cn(
                  "p-2 border-t",
                  theme === "light"
                    ? "bg-gray-100 border-gray-200"
                    : "bg-black/50 border-white/10",
                  "backdrop-blur-sm"
                )}
              >
                <div className="flex flex-wrap gap-2">
                  {fileUploads.map((file, index) => (
                    <div
                      key={index}
                      className={cn(
                        "relative rounded-md p-2 pr-8 flex items-center",
                        theme === "light"
                          ? "bg-gray-200"
                          : "bg-white/10 backdrop-blur-sm"
                      )}
                    >
                      {file.type.startsWith("image/") ? (
                        <Image
                          className={cn(
                            "h-4 w-4 mr-2",
                            theme === "light"
                              ? "text-gray-700"
                              : "text-white/70"
                          )}
                        />
                      ) : (
                        <File
                          className={cn(
                            "h-4 w-4 mr-2",
                            theme === "light"
                              ? "text-gray-700"
                              : "text-white/70"
                          )}
                        />
                      )}
                      <span
                        className={cn(
                          "text-xs truncate max-w-[150px]",
                          theme === "light" ? "text-gray-800" : "text-white/90"
                        )}
                      >
                        {file.name}
                      </span>
                      <button
                        type="button"
                        aria-label="Remove file"
                        className={cn(
                          "absolute top-1 right-1",
                          theme === "light"
                            ? "text-gray-500 hover:text-gray-900"
                            : "text-white/50 hover:text-white"
                        )}
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                <input
                  aria-label="File upload"
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileSelect}
                  multiple
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn(
                    theme === "light"
                      ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                  onClick={openFileDialog}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
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
                  disabled={!messageInput.trim() && fileUploads.length === 0}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          /* Stats Dashboard */
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {/* Top Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card
                  className={cn(
                    theme === "light"
                      ? "bg-white"
                      : "bg-black/30 border-white/10"
                  )}
                >
                  <CardContent className="p-6 flex items-center">
                    <div
                      className={cn(
                        "p-3 rounded-full mr-4",
                        theme === "light" ? "bg-blue-100" : "bg-blue-500/20"
                      )}
                    >
                      <Activity
                        className={cn(
                          "h-6 w-6",
                          theme === "light" ? "text-blue-600" : "text-blue-400"
                        )}
                      />
                    </div>
                    <div>
                      <p
                        className={cn(
                          "text-sm font-medium",
                          theme === "light" ? "text-gray-500" : "text-white/70"
                        )}
                      >
                        Weekly Playtime
                      </p>
                      <p
                        className={cn(
                          "text-2xl font-bold",
                          theme === "light" ? "text-gray-900" : "text-white"
                        )}
                      >
                        37.8 hrs
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={cn(
                    theme === "light"
                      ? "bg-white"
                      : "bg-black/30 border-white/10"
                  )}
                >
                  <CardContent className="p-6 flex items-center">
                    <div
                      className={cn(
                        "p-3 rounded-full mr-4",
                        theme === "light" ? "bg-green-100" : "bg-green-500/20"
                      )}
                    >
                      <Trophy
                        className={cn(
                          "h-6 w-6",
                          theme === "light"
                            ? "text-green-600"
                            : "text-green-400"
                        )}
                      />
                    </div>
                    <div>
                      <p
                        className={cn(
                          "text-sm font-medium",
                          theme === "light" ? "text-gray-500" : "text-white/70"
                        )}
                      >
                        Win Rate
                      </p>
                      <p
                        className={cn(
                          "text-2xl font-bold",
                          theme === "light" ? "text-gray-900" : "text-white"
                        )}
                      >
                        72%
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={cn(
                    theme === "light"
                      ? "bg-white"
                      : "bg-black/30 border-white/10"
                  )}
                >
                  <CardContent className="p-6 flex items-center">
                    <div
                      className={cn(
                        "p-3 rounded-full mr-4",
                        theme === "light" ? "bg-purple-100" : "bg-purple-500/20"
                      )}
                    >
                      <Target
                        className={cn(
                          "h-6 w-6",
                          theme === "light"
                            ? "text-purple-600"
                            : "text-purple-400"
                        )}
                      />
                    </div>
                    <div>
                      <p
                        className={cn(
                          "text-sm font-medium",
                          theme === "light" ? "text-gray-500" : "text-white/70"
                        )}
                      >
                        Accuracy
                      </p>
                      <p
                        className={cn(
                          "text-2xl font-bold",
                          theme === "light" ? "text-gray-900" : "text-white"
                        )}
                      >
                        85%
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={cn(
                    theme === "light"
                      ? "bg-white"
                      : "bg-black/30 border-white/10"
                  )}
                >
                  <CardContent className="p-6 flex items-center">
                    <div
                      className={cn(
                        "p-3 rounded-full mr-4",
                        theme === "light" ? "bg-amber-100" : "bg-amber-500/20"
                      )}
                    >
                      <Calendar
                        className={cn(
                          "h-6 w-6",
                          theme === "light"
                            ? "text-amber-600"
                            : "text-amber-400"
                        )}
                      />
                    </div>
                    <div>
                      <p
                        className={cn(
                          "text-sm font-medium",
                          theme === "light" ? "text-gray-500" : "text-white/70"
                        )}
                      >
                        Upcoming Events
                      </p>
                      <p
                        className={cn(
                          "text-2xl font-bold",
                          theme === "light" ? "text-gray-900" : "text-white"
                        )}
                      >
                        3
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Activity Chart */}
                <Card
                  className={cn(
                    theme === "light"
                      ? "bg-white"
                      : "bg-black/30 border-white/10"
                  )}
                >
                  <CardHeader>
                    <CardTitle
                      className={
                        theme === "light" ? "text-gray-900" : "text-white"
                      }
                    >
                      Weekly Gaming Activity
                    </CardTitle>
                    <CardDescription
                      className={
                        theme === "light" ? "text-gray-500" : "text-white/70"
                      }
                    >
                      Hours played per day over the last week
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={ACTIVITY_DATA}>
                          <defs>
                            <linearGradient
                              id="colorHours"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#FF4560"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#FF4560"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={
                              theme === "light"
                                ? "#e5e7eb"
                                : "rgba(255, 255, 255, 0.1)"
                            }
                          />
                          <XAxis
                            dataKey="name"
                            stroke={
                              theme === "light"
                                ? "#6b7280"
                                : "rgba(255, 255, 255, 0.7)"
                            }
                          />
                          <YAxis
                            stroke={
                              theme === "light"
                                ? "#6b7280"
                                : "rgba(255, 255, 255, 0.7)"
                            }
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor:
                                theme === "light"
                                  ? "#fff"
                                  : "rgba(0, 0, 0, 0.8)",
                              borderColor:
                                theme === "light"
                                  ? "#e5e7eb"
                                  : "rgba(255, 255, 255, 0.1)",
                              color: theme === "light" ? "#111827" : "#fff",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="hours"
                            stroke="#FF4560"
                            fillOpacity={1}
                            fill="url(#colorHours)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Game Distribution Chart */}
                <Card
                  className={cn(
                    theme === "light"
                      ? "bg-white"
                      : "bg-black/30 border-white/10"
                  )}
                >
                  <CardHeader>
                    <CardTitle
                      className={
                        theme === "light" ? "text-gray-900" : "text-white"
                      }
                    >
                      Game Distribution
                    </CardTitle>
                    <CardDescription
                      className={
                        theme === "light" ? "text-gray-500" : "text-white/70"
                      }
                    >
                      Percentage of time spent on each game
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={GAME_DISTRIBUTION}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {GAME_DISTRIBUTION.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor:
                                theme === "light"
                                  ? "#fff"
                                  : "rgba(0, 0, 0, 0.8)",
                              borderColor:
                                theme === "light"
                                  ? "#e5e7eb"
                                  : "rgba(255, 255, 255, 0.1)",
                              color: theme === "light" ? "#111827" : "#fff",
                            }}
                          />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance and Leaderboard */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Chart */}
                <Card
                  className={cn(
                    theme === "light"
                      ? "bg-white"
                      : "bg-black/30 border-white/10"
                  )}
                >
                  <CardHeader>
                    <CardTitle
                      className={
                        theme === "light" ? "text-gray-900" : "text-white"
                      }
                    >
                      Performance History
                    </CardTitle>
                    <CardDescription
                      className={
                        theme === "light" ? "text-gray-500" : "text-white/70"
                      }
                    >
                      Wins vs. Losses over the last 6 months
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={PERFORMANCE_DATA}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={
                              theme === "light"
                                ? "#e5e7eb"
                                : "rgba(255, 255, 255, 0.1)"
                            }
                          />
                          <XAxis
                            dataKey="name"
                            stroke={
                              theme === "light"
                                ? "#6b7280"
                                : "rgba(255, 255, 255, 0.7)"
                            }
                          />
                          <YAxis
                            stroke={
                              theme === "light"
                                ? "#6b7280"
                                : "rgba(255, 255, 255, 0.7)"
                            }
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor:
                                theme === "light"
                                  ? "#fff"
                                  : "rgba(0, 0, 0, 0.8)",
                              borderColor:
                                theme === "light"
                                  ? "#e5e7eb"
                                  : "rgba(255, 255, 255, 0.1)",
                              color: theme === "light" ? "#111827" : "#fff",
                            }}
                          />
                          <Legend />
                          <Bar dataKey="wins" fill="#00E396" />
                          <Bar dataKey="losses" fill="#FF4560" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Leaderboard */}
                <Card
                  className={cn(
                    theme === "light"
                      ? "bg-white"
                      : "bg-black/30 border-white/10"
                  )}
                >
                  <CardHeader>
                    <CardTitle
                      className={
                        theme === "light" ? "text-gray-900" : "text-white"
                      }
                    >
                      Top Players Leaderboard
                    </CardTitle>
                    <CardDescription
                      className={
                        theme === "light" ? "text-gray-500" : "text-white/70"
                      }
                    >
                      Rankings based on performance score
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow
                          className={
                            theme === "light"
                              ? "hover:bg-gray-100"
                              : "hover:bg-white/5"
                          }
                        >
                          <TableHead
                            className={
                              theme === "light" ? "text-gray-900" : "text-white"
                            }
                          >
                            Rank
                          </TableHead>
                          <TableHead
                            className={
                              theme === "light" ? "text-gray-900" : "text-white"
                            }
                          >
                            Player
                          </TableHead>
                          <TableHead
                            className={
                              theme === "light" ? "text-gray-900" : "text-white"
                            }
                          >
                            Score
                          </TableHead>
                          <TableHead
                            className={
                              theme === "light" ? "text-gray-900" : "text-white"
                            }
                          >
                            Win Rate
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {LEADERBOARD_DATA.map((player) => (
                          <TableRow
                            key={player.rank}
                            className={
                              theme === "light"
                                ? "hover:bg-gray-100"
                                : "hover:bg-white/5"
                            }
                          >
                            <TableCell
                              className={cn(
                                "font-medium",
                                theme === "light"
                                  ? "text-gray-900"
                                  : "text-white"
                              )}
                            >
                              {player.rank}
                            </TableCell>
                            <TableCell
                              className={
                                theme === "light"
                                  ? "text-gray-700"
                                  : "text-white/90"
                              }
                            >
                              {player.name}
                            </TableCell>
                            <TableCell
                              className={
                                theme === "light"
                                  ? "text-gray-700"
                                  : "text-white/90"
                              }
                            >
                              {player.score}
                            </TableCell>
                            <TableCell
                              className={
                                theme === "light"
                                  ? "text-gray-700"
                                  : "text-white/90"
                              }
                            >
                              {player.winRate}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Events */}
              <Card
                className={cn(
                  theme === "light" ? "bg-white" : "bg-black/30 border-white/10"
                )}
              >
                <CardHeader>
                  <CardTitle
                    className={
                      theme === "light" ? "text-gray-900" : "text-white"
                    }
                  >
                    Upcoming Events
                  </CardTitle>
                  <CardDescription
                    className={
                      theme === "light" ? "text-gray-500" : "text-white/70"
                    }
                  >
                    Gaming tournaments and competitions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {UPCOMING_EVENTS.map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          "p-4 rounded-lg border flex items-center justify-between",
                          theme === "light"
                            ? "bg-gray-50 border-gray-200"
                            : "bg-white/5 border-white/10"
                        )}
                      >
                        <div>
                          <h3
                            className={cn(
                              "font-medium",
                              theme === "light" ? "text-gray-900" : "text-white"
                            )}
                          >
                            {event.name}
                          </h3>
                          <p
                            className={
                              theme === "light"
                                ? "text-gray-500"
                                : "text-white/70"
                            }
                          >
                            {new Date(event.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={cn(
                              "font-medium",
                              theme === "light" ? "text-gray-900" : "text-white"
                            )}
                          >
                            {event.participants} Participants
                          </p>
                          <Button
                            size="sm"
                            className={cn(
                              "mt-2",
                              theme === "light"
                                ? "bg-red-500 hover:bg-red-600 text-white"
                                : "bg-red-600 hover:bg-red-700 text-white"
                            )}
                          >
                            Register
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        )}
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
