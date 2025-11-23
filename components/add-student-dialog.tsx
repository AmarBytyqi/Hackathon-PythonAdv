"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { apiClient, type User } from "@/lib/api-client"

interface AddStudentDialogProps {
  onAdd: () => Promise<void>
  parents: User[]
}

export function AddStudentDialog({ onAdd, parents }: AddStudentDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [age, setAge] = useState("")
  const [selectedParentId, setSelectedParentId] = useState("")
  const [studentUsername, setStudentUsername] = useState("") // Added student username field
  const [studentPassword, setStudentPassword] = useState("") // Added student password field

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (name && surname && age && selectedParentId && studentUsername && studentPassword) {
      const result = await apiClient.addStudent(name, surname, Number.parseInt(age), selectedParentId)

      if (result) {
        const accountCreated = await apiClient.createStudentAccount(result.id, studentUsername, studentPassword)

        if (accountCreated) {
          setName("")
          setSurname("")
          setAge("")
          setSelectedParentId("")
          setStudentUsername("")
          setStudentPassword("")
          setOpen(false)
          await onAdd()
        }
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Enter the student's information, select their parent, and create student login credentials.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">First Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="surname">Surname</Label>
              <Input
                id="surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="Doe"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="15"
                min="5"
                max="18"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="parent">Select Parent</Label>
              <Select value={selectedParentId} onValueChange={setSelectedParentId}>
                <SelectTrigger id="parent">
                  <SelectValue placeholder="Choose a parent..." />
                </SelectTrigger>
                <SelectContent>
                  {parents.map((parent) => (
                    <SelectItem key={parent.username} value={parent.username}>
                      {parent.name} ({parent.username})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {parents.length === 0 && <p className="text-sm text-muted-foreground">No parents registered yet</p>}
            </div>
            <div className="border-t pt-4">
              <h4 className="font-semibold text-sm mb-3">Student Login Credentials</h4>
              <div className="grid gap-2">
                <Label htmlFor="student-username">Student Username</Label>
                <Input
                  id="student-username"
                  value={studentUsername}
                  onChange={(e) => setStudentUsername(e.target.value)}
                  placeholder="johndoe"
                  required
                />
              </div>
              <div className="grid gap-2 mt-2">
                <Label htmlFor="student-password">Student Password</Label>
                <Input
                  id="student-password"
                  type="password"
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!selectedParentId || !studentUsername || !studentPassword}>
              Add Student
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
