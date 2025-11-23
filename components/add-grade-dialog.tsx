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
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

interface AddGradeDialogProps {
  subject: string
  onAdd: (grade: number, comment: string) => void
}

export function AddGradeDialog({ subject, onAdd }: AddGradeDialogProps) {
  const [open, setOpen] = useState(false)
  const [grade, setGrade] = useState("")
  const [comment, setComment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (grade) {
      onAdd(Number.parseFloat(grade), comment)
      setGrade("")
      setComment("")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Grade
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Grade for {subject}</DialogTitle>
            <DialogDescription>Enter the grade and optional feedback</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="grade">Grade (0-100)</Label>
              <Input
                id="grade"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="85"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="comment">Comment (Optional)</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Great improvement! Keep up the good work."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Grade</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
