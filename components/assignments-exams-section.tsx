"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Calendar, Clock } from "lucide-react"
import { AddAssignmentDialog } from "./add-assignment-dialog"
import { AddExamDialog } from "./add-exam-dialog"

interface Assignment {
  id: string
  title: string
  description: string
  subject: string
  dueDate: string
  createdBy: string
  createdAt: string
}

interface Exam {
  id: string
  title: string
  subject: string
  date: string
  startTime: string
  endTime: string
  createdBy: string
  createdAt: string
}

interface AssignmentsExamsSectionProps {
  subject: string
  assignments: Assignment[]
  exams: Exam[]
  isTeacher: boolean
  onAddAssignment: (title: string, description: string, dueDate: string) => Promise<void>
  onAddExam: (title: string, date: string, startTime: string, endTime: string) => Promise<void>
  onDeleteAssignment: (assignmentId: string) => Promise<void>
  onDeleteExam: (examId: string) => Promise<void>
}

export function AssignmentsExamsSection({
  subject,
  assignments,
  exams,
  isTeacher,
  onAddAssignment,
  onAddExam,
  onDeleteAssignment,
  onDeleteExam,
}: AssignmentsExamsSectionProps) {
  return (
    <div className="space-y-4 h-full">
      <Card className="flex flex-col h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="text-base">Tasks & Exams</CardTitle>
              <CardDescription className="text-xs">{subject}</CardDescription>
            </div>
            {isTeacher && (
              <div className="flex gap-2">
                <AddAssignmentDialog subject={subject} onAdd={onAddAssignment} />
                <AddExamDialog subject={subject} onAdd={onAddExam} />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          <div className="space-y-3">
            {/* Assignments */}
            {assignments.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Assignments</p>
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="p-2 border rounded text-xs bg-amber-50/50 hover:bg-amber-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium">{assignment.title}</p>
                        <p className="text-muted-foreground line-clamp-1">{assignment.description}</p>
                        <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {isTeacher && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteAssignment(assignment.id)}
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Exams */}
            {exams.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Exams</p>
                {exams.map((exam) => (
                  <div
                    key={exam.id}
                    className="p-2 border rounded text-xs bg-blue-50/50 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium">{exam.title}</p>
                        <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(exam.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>
                            {exam.startTime} - {exam.endTime}
                          </span>
                        </div>
                      </div>
                      {isTeacher && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteExam(exam.id)}
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {assignments.length === 0 && exams.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">No tasks or exams</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
