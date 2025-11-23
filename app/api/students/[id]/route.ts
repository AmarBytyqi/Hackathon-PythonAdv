import { type NextRequest, NextResponse } from "next/server"
import { getStudent, getStudentGrades } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const studentId = params.id
    console.log("[v0] Fetching student profile:", studentId)

    const student = getStudent(studentId)

    if (!student) {
      console.log("[v0] Student not found:", studentId)
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    const grades = getStudentGrades(studentId)

    if (!grades) {
      console.log("[v0] Grades not found for student:", studentId)
      return NextResponse.json({ error: "Grades not found" }, { status: 404 })
    }

    console.log("[v0] Student profile fetched successfully")
    return NextResponse.json({
      student,
      grades,
    })
  } catch (error) {
    console.error("[v0] Get student profile error:", error)
    return NextResponse.json({ error: "Failed to fetch student profile" }, { status: 500 })
  }
}
