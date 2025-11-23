import { type User, type Student, type Grade, TEACHERS } from "./types"

// Initialize storage with teachers if not exists
if (typeof window !== "undefined") {
  const users = localStorage.getItem("users")
  if (!users) {
    localStorage.setItem("users", JSON.stringify(TEACHERS))
  }

  const students = localStorage.getItem("students")
  if (!students) {
    localStorage.setItem("students", JSON.stringify([]))
  }

  const grades = localStorage.getItem("grades")
  if (!grades) {
    localStorage.setItem("grades", JSON.stringify([]))
  }

  const assignments = localStorage.getItem("assignments")
  if (!assignments) {
    localStorage.setItem("assignments", JSON.stringify([]))
  }

  const exams = localStorage.getItem("exams")
  if (!exams) {
    localStorage.setItem("exams", JSON.stringify([]))
  }

  const messages = localStorage.getItem("messages")
  if (!messages) {
    localStorage.setItem("messages", JSON.stringify([]))
  }
}

export const storage = {
  getUsers(): User[] {
    if (typeof window === "undefined") return []
    const users = localStorage.getItem("users")
    return users ? JSON.parse(users) : TEACHERS
  },

  addUser(user: User): void {
    const users = this.getUsers()
    users.push(user)
    localStorage.setItem("users", JSON.stringify(users))
  },

  getStudents(): Student[] {
    if (typeof window === "undefined") return []
    const students = localStorage.getItem("students")
    return students ? JSON.parse(students) : []
  },

  addStudent(student: Student): void {
    const students = this.getStudents()
    students.push(student)
    localStorage.setItem("students", JSON.stringify(students))
  },

  updateStudent(id: string, updates: Partial<Student>): void {
    const students = this.getStudents()
    const index = students.findIndex((s) => s.id === id)
    if (index !== -1) {
      students[index] = { ...students[index], ...updates }
      localStorage.setItem("students", JSON.stringify(students))
    }
  },

  deleteStudent(id: string): void {
    const students = this.getStudents()
    const filtered = students.filter((s) => s.id !== id)
    localStorage.setItem("students", JSON.stringify(filtered))

    // Also delete all grades for this student
    const grades = this.getGrades()
    const filteredGrades = grades.filter((g) => g.studentId !== id)
    localStorage.setItem("grades", JSON.stringify(filteredGrades))
  },

  getGrades(): Grade[] {
    if (typeof window === "undefined") return []
    const grades = localStorage.getItem("grades")
    return grades ? JSON.parse(grades) : []
  },

  addGrade(grade: Grade): void {
    const grades = this.getGrades()
    grades.push(grade)
    localStorage.setItem("grades", JSON.stringify(grades))
  },

  updateGrade(id: string, updates: Partial<Grade>): void {
    const grades = this.getGrades()
    const index = grades.findIndex((g) => g.id === id)
    if (index !== -1) {
      grades[index] = { ...grades[index], ...updates }
      localStorage.setItem("grades", JSON.stringify(grades))
    }
  },

  deleteGrade(id: string): void {
    const grades = this.getGrades()
    const filtered = grades.filter((g) => g.id !== id)
    localStorage.setItem("grades", JSON.stringify(filtered))
  },

  getAssignments(): any[] {
    if (typeof window === "undefined") return []
    const assignments = localStorage.getItem("assignments")
    return assignments ? JSON.parse(assignments) : []
  },

  addAssignment(assignment: any): void {
    const assignments = this.getAssignments()
    assignments.push(assignment)
    localStorage.setItem("assignments", JSON.stringify(assignments))
  },

  deleteAssignment(id: string): void {
    const assignments = this.getAssignments()
    const filtered = assignments.filter((a) => a.id !== id)
    localStorage.setItem("assignments", JSON.stringify(filtered))
  },

  getExams(): any[] {
    if (typeof window === "undefined") return []
    const exams = localStorage.getItem("exams")
    return exams ? JSON.parse(exams) : []
  },

  addExam(exam: any): void {
    const exams = this.getExams()
    exams.push(exam)
    localStorage.setItem("exams", JSON.stringify(exams))
  },

  deleteExam(id: string): void {
    const exams = this.getExams()
    const filtered = exams.filter((e) => e.id !== id)
    localStorage.setItem("exams", JSON.stringify(filtered))
  },

  getMessages(): any[] {
    if (typeof window === "undefined") return []
    const messages = localStorage.getItem("messages")
    return messages ? JSON.parse(messages) : []
  },

  addMessage(message: any): void {
    const messages = this.getMessages()
    messages.push(message)
    localStorage.setItem("messages", JSON.stringify(messages))
  },

  deleteMessage(id: string): void {
    const messages = this.getMessages()
    const filtered = messages.filter((m) => m.id !== id)
    localStorage.setItem("messages", JSON.stringify(filtered))
  },

  updateMessage(id: string, updates: any): void {
    const messages = this.getMessages()
    const index = messages.findIndex((m) => m.id === id)
    if (index !== -1) {
      messages[index] = { ...messages[index], ...updates }
      localStorage.setItem("messages", JSON.stringify(messages))
    }
  },
}
