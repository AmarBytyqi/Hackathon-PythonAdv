import { type NextRequest, NextResponse } from "next/server"
import { registerParent } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { username, password, name } = await request.json()

    console.log("[v0] Register attempt:", username)

    const user = registerParent(username, password, name)

    if (user) {
      console.log("[v0] Registration successful:", user)
      return NextResponse.json({ user })
    } else {
      console.log("[v0] Registration failed: Username already exists")
      return NextResponse.json({ error: "Username already exists" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Register error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
