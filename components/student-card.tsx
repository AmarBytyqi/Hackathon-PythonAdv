"use client"

import { useEffect, useState } from "react"
import type { Student } from "@/lib/api-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { apiClient } from "@/lib/api-client"

interface StudentCardProps {
  student: Student
  onDelete?: (id: string) => void
}

export function StudentCard({ student, onDelete }: StudentCardProps) {
  const [gpa, setGpa] = useState<number | null>(null)

  useEffect(() => {
    const loadGPA = async () => {
      const calculatedGPA = await apiClient.calculateGPA(student.id)
      setGpa(calculatedGPA)
    }
    loadGPA()
  }, [student.id])

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">
          {student.name} {student.surname}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">Age: {student.age}</p>
        {gpa !== null && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">GPA:</span>
            <Badge variant={gpa >= 70 ? "default" : gpa >= 50 ? "secondary" : "destructive"}>{gpa.toFixed(2)}</Badge>
          </div>
        )}
        <div className="flex gap-2">
          <Link href={`/student/${student.id}`} className="flex-1">
            <Button className="w-full" variant="default">
              View Profile
            </Button>
          </Link>
          {onDelete && (
            <Button variant="destructive" onClick={() => onDelete(student.id)}>
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
