"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MessageSquare, Send } from "lucide-react"
import { apiClient, type User } from "@/lib/api-client"

interface StudentMessagingProps {
  currentUser: User
}

export function StudentMessaging({ currentUser }: StudentMessagingProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [recipient, setRecipient] = useState("")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    const userMessages = await apiClient.getMessages(currentUser.username)
    setMessages(userMessages)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    await apiClient.sendMessage(currentUser.username, recipient, subject, content)

    setRecipient("")
    setSubject("")
    setContent("")
    setOpen(false)
    setLoading(false)

    // Reload messages
    await loadMessages()
  }

  const handleReply = async (messageId: string, replyContent: string) => {
    await apiClient.replyToMessage(messageId, currentUser.username, replyContent)
    await loadMessages()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Messages
        </CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Send className="h-4 w-4 mr-2" />
              Message
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSendMessage}>
              <DialogHeader>
                <DialogTitle>Send Message</DialogTitle>
                <DialogDescription>Send a message to your parents</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="recipient">Recipient</Label>
                  <Input
                    id="recipient"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Parent username"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Message subject"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Message</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Your message"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">No messages yet</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-sm">{msg.from}</p>
                  <p className="text-xs text-muted-foreground">{msg.subject}</p>
                </div>
                <p className="text-xs text-muted-foreground">{new Date(msg.timestamp).toLocaleDateString()}</p>
              </div>
              <p className="text-sm">{msg.content}</p>
              {msg.replies && msg.replies.length > 0 && (
                <div className="border-t pt-2 space-y-2 mt-2">
                  {msg.replies.map((reply: any) => (
                    <div key={reply.id} className="text-sm bg-muted p-2 rounded">
                      <p className="font-semibold">{reply.from}</p>
                      <p>{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
