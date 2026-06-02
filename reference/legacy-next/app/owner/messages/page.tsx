"use client"

import { OwnerNav } from "@/components/navigation/owner-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Send, Paperclip, MoreVertical, Star } from "lucide-react"
import { useState } from "react"

export default function OwnerMessagesPage() {
  const [selectedThread, setSelectedThread] = useState(1)

  const threads = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Chief Stew Applicant",
      lastMessage: "I'm available this week. Would Thursday or Friday work?",
      timestamp: "1 hour ago",
      unread: 1,
      avatar: "/placeholder.svg?height=40&width=40",
      match: 95,
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Deckhand Applicant",
      lastMessage: "Thank you for considering my application.",
      timestamp: "Yesterday",
      unread: 0,
      avatar: "/placeholder.svg?height=40&width=40",
      match: 88,
    },
    {
      id: 3,
      name: "Emma Williams",
      role: "Chef Applicant",
      lastMessage: "I have experience with dietary restrictions...",
      timestamp: "2 days ago",
      unread: 0,
      avatar: "/placeholder.svg?height=40&width=40",
      match: 92,
    },
  ]

  const messages = [
    {
      id: 1,
      sender: "me",
      text: "Hi! I reviewed your application for the Chief Stew position. Your experience looks excellent.",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      sender: "them",
      text: "Thank you! I'm very interested in the position. I have 8 years of experience on similar vessels.",
      timestamp: "10:35 AM",
    },
    {
      id: 3,
      sender: "me",
      text: "That's great to hear. We're particularly impressed with your certifications and language skills.",
      timestamp: "10:40 AM",
    },
    {
      id: 4,
      sender: "me",
      text: "When would you be available for an interview?",
      timestamp: "10:42 AM",
    },
    {
      id: 5,
      sender: "them",
      text: "I'm available this week. Would Thursday or Friday work for you?",
      timestamp: "11:15 AM",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <OwnerNav />

      <div className="flex-1 py-8">
        <div className="container max-w-7xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Messages</h1>
            <p className="text-muted-foreground">Communicate with candidates</p>
          </div>

          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-[350px_1fr] h-[calc(100vh-280px)]">
              {/* Threads List */}
              <div className="border-r">
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search messages..." className="pl-9" />
                  </div>
                </div>

                <ScrollArea className="h-[calc(100vh-360px)]">
                  <div className="divide-y">
                    {threads.map((thread) => (
                      <button
                        key={thread.id}
                        onClick={() => setSelectedThread(thread.id)}
                        className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                          selectedThread === thread.id ? "bg-muted" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage src={thread.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {thread.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-sm truncate">{thread.name}</p>
                                  <Badge variant="secondary" className="text-xs gap-1">
                                    <Star className="h-2.5 w-2.5 fill-primary text-primary" />
                                    {thread.match}%
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground truncate">{thread.role}</p>
                              </div>
                              {thread.unread > 0 && (
                                <Badge
                                  variant="default"
                                  className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                                >
                                  {thread.unread}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{thread.lastMessage}</p>
                            <p className="text-xs text-muted-foreground mt-1">{thread.timestamp}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Message Thread */}
              <div className="flex flex-col">
                {/* Thread Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">Sarah Johnson</p>
                        <Badge variant="secondary" className="text-xs gap-1">
                          <Star className="h-2.5 w-2.5 fill-primary text-primary" />
                          95%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Chief Stew Applicant</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[70%] ${message.sender === "me" ? "order-2" : "order-1"}`}>
                          <div
                            className={`rounded-lg p-3 ${
                              message.sender === "me" ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 px-1">{message.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex items-end gap-2">
                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                      <Input placeholder="Type your message..." className="resize-none" />
                    </div>
                    <Button size="icon" className="flex-shrink-0">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
