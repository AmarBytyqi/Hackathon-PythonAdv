import { type NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, username, password, name } = body

    let pythonCommand = ""

    if (action === "login") {
      pythonCommand = `python3 -c "
import sys
import json
sys.path.append('scripts')
from database import authenticate_user

user = authenticate_user('${username}', '${password}')
print(json.dumps({'user': user}))
"`
    } else if (action === "register") {
      pythonCommand = `python3 -c "
import sys
import json
sys.path.append('scripts')
from database import register_parent

user = register_parent('${username}', '${password}', '${name}')
print(json.dumps({'user': user}))
"`
    }

    const { stdout } = await execAsync(pythonCommand)
    const result = JSON.parse(stdout.trim())

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Python auth error:", error)
    return NextResponse.json({ user: null }, { status: 500 })
  }
}
