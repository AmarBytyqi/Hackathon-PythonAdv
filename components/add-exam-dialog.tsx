"use client"

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
import { Plus } from "lucide-react"

interface AddExamDialogProps {
  subject: string
  onAdd: (title: string, date: string, startTime: string, endTime: string) => Promise<void>
}

export function AddExamDialog({ subject, onAdd }: AddExamDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

  const handleSubmit = async () => {
    if (!title || !date || !startTime || !endTime) return

    setLoading(true)
    try {
      await onAdd(title, date, startTime, endTime)
      setTitle("")
      setDate("")
      setStartTime("")
      setEndTime("")
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2 bg-transparent">
          <Plus className="h-4 w-4" />
          Add Exam
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Exam - {subject}</DialogTitle>
          <DialogDescription>Schedule a new exam for this subject</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="exam-title">Exam Title</Label>
            <Input
              id="exam-title"
              placeholder="e.g., Midterm Exam"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="exam-date">Exam Date</Label>
            <Input id="exam-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-time">Start Time</Label>
              <Input id="start-time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="end-time">End Time</Label>
              <Input id="end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !title || !date || !startTime || !endTime}>
            {loading ? "Creating..." : "Create Exam"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
