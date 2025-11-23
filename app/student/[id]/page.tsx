"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { apiClient, type Student, type StudentGrades, type AttendanceRecord } from "@/lib/api-client"
import { GradeChart } from "@/components/grade-chart"
import { AddGradeDialog } from "@/components/add-grade-dialog"
import { AttendanceCalendar } from "@/components/attendance-calendar"
import { AttendanceDialog } from "@/components/attendance-dialog"
import { Button } from "@/components/ui/button"
import { ArrowLeft, GraduationCap } from "lucide-react"
import { AssignmentsExamsSection } from "@/components/assignments-exams-section"

const SUBJECTS = [
  "English",
  "Math",
  "Biology",
  "Chemistry",
  "Physics",
  "History",
  "Geography",
  "Computer Science",
  "Art",
  "Physical Education",
]

export default function StudentProfile() {
  const router = useRouter()
  const params = useParams()
  const [student, setStudent] = useState<Student | null>(null)
  const [grades, setGrades] = useState<StudentGrades | null>(null)
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [assignments, setAssignments] = useState<any[]>([]) // Added assignments state
  const [exams, setExams] = useState<any[]>([]) // Added exams state

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      router.push("/")
      return
    }

    const user = JSON.parse(userStr)
    setCurrentUser(user)
    loadStudentProfile()
  }, [params.id, router])

  const loadStudentProfile = async () => {
    setLoading(true)
    const profile = await apiClient.getStudentProfile(params.id as string)
    if (profile) {
      setStudent(profile.student)
      setGrades(profile.grades)
      const allAssignments = await apiClient.getAllAssignments()
      const allExams = await apiClient.getAllExams()
      setAssignments(allAssignments)
      setExams(allExams)
    }
    const attendanceRecords = await apiClient.getAttendance(params.id as string)
    setAttendance(attendanceRecords)
    setLoading(false)
  }

  const handleAddGrade = (subject: string) => {
    return async (grade: number, comment?: string) => {
      const success = await apiClient.addGrade(params.id as string, subject, grade, currentUser.username, comment)
      if (success) {
        await loadStudentProfile()
      }
    }
  }

  const handleAddAttendance = async () => {
    await loadStudentProfile()
  }

  const canAddGrade = (subject: string) => {
    return currentUser?.role === "teacher" && currentUser?.subject === subject
  }

  const handleBack = () => {
    if (currentUser?.role === "teacher") {
      router.push("/teacher/dashboard")
    } else {
      router.push("/parent/dashboard")
    }
  }

  const handleAddAssignment = (subject: string) => {
    return async (title: string, description: string, dueDate: string) => {
      const success = await apiClient.createAssignment(title, description, subject, dueDate, currentUser.username)
      if (success) {
        await loadStudentProfile()
      }
    }
  }

  const handleAddExam = (subject: string) => {
    return async (title: string, date: string, startTime: string, endTime: string) => {
      const success = await apiClient.createExam(title, subject, date, startTime, endTime, currentUser.username)
      if (success) {
        await loadStudentProfile()
      }
    }
  }

  const handleDeleteAssignment = async (assignmentId: string) => {
    const success = await apiClient.deleteAssignment(assignmentId)
    if (success) {
      await loadStudentProfile()
    }
  }

  const handleDeleteExam = async (examId: string) => {
    const success = await apiClient.deleteExam(examId)
    if (success) {
      await loadStudentProfile()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading student profile...</p>
      </div>
    )
  }

  if (!student || !currentUser || !grades) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-full p-2">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {student.name} {student.surname}
                </h1>
                <p className="text-sm text-muted-foreground">Age: {student.age}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {currentUser.role === "teacher" && (
            <div className="flex justify-end">
              <AttendanceDialog studentId={student.id} onAdd={handleAddAttendance} />
            </div>
          )}

          {SUBJECTS.map((subject) => {
            const subjectGrades = grades[subject] || []
            const subjectAssignments = assignments.filter((a) => a.subject === subject)
            const subjectExams = exams.filter((e) => e.subject === subject)

            return (
              <div key={subject} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{subject}</h2>
                  {canAddGrade(subject) && <AddGradeDialog subject={subject} onAdd={handleAddGrade(subject)} />}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <GradeChart subject={subject} grades={subjectGrades} />
                  </div>
                  <div className="lg:col-span-1">
                    {(subjectAssignments.length > 0 || subjectExams.length > 0 || currentUser.role === "teacher") && (
                      <AssignmentsExamsSection
                        subject={subject}
                        assignments={subjectAssignments}
                        exams={subjectExams}
                        isTeacher={currentUser?.role === "teacher"}
                        onAddAssignment={handleAddAssignment(subject)}
                        onAddExam={handleAddExam(subject)}
                        onDeleteAssignment={handleDeleteAssignment}
                        onDeleteExam={handleDeleteExam}
                      />
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          <div className="mt-8">
            <AttendanceCalendar studentId={student.id} attendance={attendance} />
          </div>
        </div>
      </main>
    </div>
  )
}
