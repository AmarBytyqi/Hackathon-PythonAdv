"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut } from "lucide-react"
import type { User } from "@/lib/api-client"
import { StudentMessaging } from "@/components/student-messaging"

export default function StudentDashboard() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/")
      return
    }
    const userData = JSON.parse(user) as User
    if (userData.role !== "student") {
      router.push("/")
      return
    }
    setCurrentUser(userData)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {currentUser.name}</h1>
            <p className="text-muted-foreground">Student Dashboard</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Profile and Grades */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Grades</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">View your grades by going to your profile</p>
                <Button
                  onClick={() => {
                    // Navigate to student's own profile using studentId
                    if (currentUser.studentId) {
                      router.push(`/student/${currentUser.studentId}`)
                    }
                  }}
                  className="mt-4"
                >
                  View Full Profile
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Messaging */}
          <div>
            <StudentMessaging currentUser={currentUser} />
          </div>
        </div>
      </div>
    </div>
  )
}
