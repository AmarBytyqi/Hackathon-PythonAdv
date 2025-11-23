import { type NextRequest, NextResponse } from "next/server"
import { addGrade } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { studentId, subject, grade, teacher } = await request.json()
    console.log("[v0] Adding grade:", { studentId, subject, grade, teacher })

    const gradeEntry = addGrade(studentId, subject, grade, teacher)

    if (gradeEntry) {
      console.log("[v0] Grade added successfully:", gradeEntry)
      return NextResponse.json(gradeEntry)
    } else {
      console.log("[v0] Failed to add grade - student not found")
      return NextResponse.json({ error: "Student not found" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Add grade error:", error)
    return NextResponse.json({ error: "Failed to add grade" }, { status: 500 })
  }
}
