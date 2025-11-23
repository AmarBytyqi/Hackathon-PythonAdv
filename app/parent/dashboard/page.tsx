"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiClient, type Student, type Message, type User } from "@/lib/api-client"
import { StudentCard } from "@/components/student-card"
import { MessageDialog } from "@/components/message-dialog"
import { MessageList } from "@/components/message-list"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, GraduationCap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ParentDashboard() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [teachers, setTeachers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      router.push("/")
      return
    }

    const user = JSON.parse(userStr)
    if (user.role !== "parent") {
      router.push("/")
      return
    }

    setCurrentUser(user)
  }, [router])

  useEffect(() => {
    if (currentUser) {
      loadData()
    }
  }, [currentUser])

  const loadData = async () => {
    setLoading(true)
    await Promise.all([loadStudents(), loadMessages(), loadTeachers()])
    setLoading(false)
  }

  const loadStudents = async () => {
    if (currentUser) {
      const fetchedStudents = await apiClient.getStudentsByParent(currentUser.username)
      console.log("[v0] Fetched students for parent", currentUser.username, ":", fetchedStudents)
      setStudents(fetchedStudents)
    }
  }

  const loadMessages = async () => {
    const userStr = localStorage.getItem("user")
    if (!userStr) return

    const user = JSON.parse(userStr)
    const fetchedMessages = await apiClient.getMessages(user.username)
    setMessages(fetchedMessages)

    const unread = fetchedMessages.filter((m) => m.to === user.username && !m.read).length
    setUnreadCount(unread)
  }

  const loadTeachers = async () => {
    const fetchedTeachers = await apiClient.getAllTeachers()
    setTeachers(fetchedTeachers)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!currentUser) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-full p-2">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Parent Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome, {currentUser.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="messages" className="gap-2">
              Messages
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Your Children's Grades</h2>
              <p className="text-sm text-muted-foreground">View your child's grades and progress</p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading students...</p>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No students assigned to your account yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students.map((student) => (
                  <StudentCard key={student.id} student={student} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="messages">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Messages</h2>
              <MessageDialog currentUser={currentUser} recipients={teachers} onMessageSent={loadMessages} />
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading messages...</p>
              </div>
            ) : (
              <MessageList
                messages={messages}
                currentUsername={currentUser.username}
                currentRole={currentUser.role}
                onMessagesChange={loadMessages}
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
