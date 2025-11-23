"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { CalendarCheck } from "lucide-react"
import { apiClient } from "@/lib/api-client"

interface AttendanceDialogProps {
  studentId: string
  onAdd: () => void
}

export function AttendanceDialog({ studentId, onAdd }: AttendanceDialogProps) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<"present" | "absent" | "late">("present")
  const [notes, setNotes] = useState("")
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    if (open) {
      const userStr = localStorage.getItem("user")
      if (userStr) {
        setCurrentUser(JSON.parse(userStr))
      }
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    await apiClient.addAttendance(studentId, status, currentUser.subject, currentUser.username, notes)

    setStatus("present")
    setNotes("")
    setOpen(false)
    onAdd()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2 bg-transparent">
          <CalendarCheck className="h-4 w-4" />
          Mark Attendance
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Mark Attendance</DialogTitle>
            <DialogDescription>Record student attendance for today</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label>Attendance Status</Label>
              <RadioGroup value={status} onValueChange={(value) => setStatus(value as any)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="present" id="present" />
                  <Label htmlFor="present" className="font-normal cursor-pointer">
                    Present
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="absent" id="absent" />
                  <Label htmlFor="absent" className="font-normal cursor-pointer">
                    Absent
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="late" id="late" />
                  <Label htmlFor="late" className="font-normal cursor-pointer">
                    Late
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes about attendance..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Mark Attendance</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
