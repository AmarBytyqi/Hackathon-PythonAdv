import { type NextRequest, NextResponse } from "next/server"
import { getAllStudents, addStudent, deleteStudent } from "@/lib/database"

export async function GET() {
  try {
    const students = getAllStudents()
    console.log("[v0] Fetched students:", students)
    return NextResponse.json(students)
  } catch (error) {
    console.error("[v0] Get students error:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, surname, age } = await request.json()
    console.log("[v0] Adding student:", { name, surname, age })

    const student = addStudent(name, surname, age)
    console.log("[v0] Student added successfully:", student)

    return NextResponse.json(student)
  } catch (error) {
    console.error("[v0] Add student error:", error)
    return NextResponse.json({ error: "Failed to add student" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("id")

    if (!studentId) {
      return NextResponse.json({ error: "Student ID required" }, { status: 400 })
    }

    console.log("[v0] Deleting student:", studentId)

    const success = deleteStudent(studentId)

    if (success) {
      console.log("[v0] Student deleted successfully")
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("[v0] Delete student error:", error)
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 })
  }
}
