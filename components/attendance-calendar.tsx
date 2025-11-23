"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { AttendanceRecord } from "@/lib/api-client"

interface AttendanceCalendarProps {
  studentId: string
  attendance: AttendanceRecord[]
}

export function AttendanceCalendar({ studentId, attendance }: AttendanceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedDayRecords, setSelectedDayRecords] = useState<AttendanceRecord[]>([])

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek }
  }

  const getAttendanceForDate = (date: Date): AttendanceRecord[] => {
    const dateStr = date.toISOString().split("T")[0]
    return attendance.filter((record) => record.date.split("T")[0] === dateStr)
  }

  const getStatusColor = (records: AttendanceRecord[]): string => {
    if (records.length === 0) return "bg-gray-100"
    const hasAbsent = records.some((r) => r.status === "absent")
    const hasLate = records.some((r) => r.status === "late")
    if (hasAbsent) return "bg-red-100 border-red-300"
    if (hasLate) return "bg-yellow-100 border-yellow-300"
    return "bg-green-100 border-green-300"
  }

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(clickedDate)
    const records = getAttendanceForDate(clickedDate)
    setSelectedDayRecords(records)
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate)
  const days = []

  // Empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-12" />)
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const records = getAttendanceForDate(date)
    const statusColor = getStatusColor(records)

    days.push(
      <button
        key={day}
        onClick={() => handleDateClick(day)}
        className={`h-12 border rounded-lg flex items-center justify-center text-sm font-medium hover:shadow-md transition-all ${statusColor}`}
      >
        {day}
      </button>,
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Attendance Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[140px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Legend */}
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded" />
            <span>Present</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded" />
            <span>Late</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded" />
            <span>Absent</span>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-muted-foreground">
              {day}
            </div>
          ))}
          {days}
        </div>

        {/* Selected date details */}
        {selectedDate && (
          <div className="mt-4 p-4 border rounded-lg bg-muted/50">
            <h4 className="font-semibold mb-2">{selectedDate.toLocaleDateString()}</h4>
            {selectedDayRecords.length === 0 ? (
              <p className="text-sm text-muted-foreground">No attendance records for this date</p>
            ) : (
              <div className="space-y-2">
                {selectedDayRecords.map((record, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{record.subject}</span>
                    <Badge
                      variant={
                        record.status === "present" ? "default" : record.status === "late" ? "secondary" : "destructive"
                      }
                    >
                      {record.status.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
