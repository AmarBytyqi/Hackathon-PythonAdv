"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MailOpen, Trash2, Send } from "lucide-react"
import { apiClient, type Message } from "@/lib/api-client"

interface MessageListProps {
  messages: Message[]
  currentUsername: string
  currentRole: "teacher" | "parent"
  onMessagesChange: () => void
}

export function MessageList({ messages, currentUsername, currentRole, onMessagesChange }: MessageListProps) {
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")

  const handleExpandMessage = async (messageId: string) => {
    if (expandedMessage === messageId) {
      setExpandedMessage(null)
      return
    }

    setExpandedMessage(messageId)
    const message = messages.find((m) => m.id === messageId)
    if (message && !message.read && message.to === currentUsername) {
      await apiClient.markMessageAsRead(messageId)
      onMessagesChange()
    }
  }

  const handleReply = async (messageId: string) => {
    if (!replyContent.trim()) {
      alert("Please enter a reply")
      return
    }

    await apiClient.replyToMessage(messageId, currentUsername, currentRole, replyContent)
    setReplyContent("")
    onMessagesChange()
  }

  const handleDelete = async (messageId: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      await apiClient.deleteMessage(messageId)
      onMessagesChange()
    }
  }

  const sortedMessages = [...messages].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return (
    <div className="space-y-4">
      {sortedMessages.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No messages yet</p>
          </CardContent>
        </Card>
      ) : (
        sortedMessages.map((message) => {
          const isExpanded = expandedMessage === message.id
          const isReceived = message.to === currentUsername
          const isUnread = isReceived && !message.read

          return (
            <Card key={message.id} className={isUnread ? "border-primary" : ""}>
              <CardHeader className="cursor-pointer" onClick={() => handleExpandMessage(message.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{message.subject}</CardTitle>
                      {isUnread && <Badge variant="default">New</Badge>}
                    </div>
                    <CardDescription className="mt-1">
                      {isReceived ? `From: ${message.from}` : `To: ${message.to}`}
                      <span className="mx-2">•</span>
                      {new Date(message.timestamp).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {isUnread ? (
                      <Mail className="h-5 w-5 text-primary" />
                    ) : (
                      <MailOpen className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {message.replies.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Replies:</h4>
                      {message.replies.map((reply) => (
                        <div key={reply.id} className="bg-muted/50 p-3 rounded-md ml-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{reply.from}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(reply.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      rows={3}
                    />
                    <div className="flex justify-between">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(message.id)}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                      <Button size="sm" onClick={() => handleReply(message.id)} className="gap-2">
                        <Send className="h-4 w-4" />
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })
      )}
    </div>
  )
}
