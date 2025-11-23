"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiClient, type Student, type Message, type User } from "@/lib/api-client"
import { StudentCard } from "@/components/student-card"
import { AddStudentDialog } from "@/components/add-student-dialog"
import { MessageDialog } from "@/components/message-dialog"
import { MessageList } from "@/components/message-list"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, GraduationCap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function TeacherDashboard() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [parents, setParents] = useState<User[]>([])
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
    if (user.role !== "teacher") {
      router.push("/")
      return
    }

    setCurrentUser(user)
    loadData()
  }, [router])

  const loadData = async () => {
    setLoading(true)
    await Promise.all([loadStudents(), loadMessages(), loadParents()])
    setLoading(false)
  }

  const loadStudents = async () => {
    const fetchedStudents = await apiClient.getStudents()
    setStudents(fetchedStudents)
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

  const loadParents = async () => {
    const fetchedParents = await apiClient.getAllParents()
    setParents(fetchedParents)
  }

  const handleAddStudent = async () => {
    await loadStudents()
  }

  const handleDeleteStudent = async (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      const success = await apiClient.deleteStudent(id)
      if (success) {
        await loadStudents()
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!currentUser) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-full p-2">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  {currentUser.name} - {currentUser.subject}
                </p>
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">My Students</h2>
              <AddStudentDialog onAdd={handleAddStudent} parents={parents} />
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading students...</p>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No students added yet</p>
                <p className="text-sm text-muted-foreground">Click "Add Student" to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students.map((student) => (
                  <StudentCard key={student.id} student={student} onDelete={handleDeleteStudent} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="messages">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Messages</h2>
              <MessageDialog currentUser={currentUser} recipients={parents} onMessageSent={loadMessages} />
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
