import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    console.log("[v0] Login attempt:", username)

    const user = authenticateUser(username, password)

    if (user) {
      console.log("[v0] Login successful:", user)
      return NextResponse.json({ user })
    } else {
      console.log("[v0] Login failed: Invalid credentials")
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
