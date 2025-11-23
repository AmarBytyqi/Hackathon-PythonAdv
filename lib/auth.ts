import type { User } from "./types"
import { storage } from "./storage"

export const auth = {
  login(username: string, password: string): User | null {
    const users = storage.getUsers()
    const user = users.find((u) => u.username === username && u.password === password)

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user))
      return user
    }

    return null
  },

  register(username: string, password: string, name: string): User | null {
    const users = storage.getUsers()

    // Check if username already exists
    if (users.find((u) => u.username === username)) {
      return null
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      password,
      role: "parent",
      name,
    }

    storage.addUser(newUser)
    localStorage.setItem("currentUser", JSON.stringify(newUser))
    return newUser
  },

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null
    const user = localStorage.getItem("currentUser")
    return user ? JSON.parse(user) : null
  },

  logout(): void {
    localStorage.removeItem("currentUser")
  },
}
