// Client-side API functions

export interface User {
  username: string
  role: "teacher" | "parent" | "student"
  name: string
  subject?: string
  profilePicture?: string
}

export interface Student {
  id: string
  name: string
  surname: string
  age: number
  parentId: string // Added parentId field
  createdAt: string // Changed from created_at to match database
}

export interface Grade {
  grade: number
  teacher: string
  date: string
  comment?: string
}

export interface Message {
  id: string
  from: string
  to: string
  subject: string
  content: string
  timestamp: string
  read: boolean
  replies: MessageReply[]
}

export interface MessageReply {
  id: string
  from: string
  content: string
  timestamp: string
}

export interface StudentGrades {
  [subject: string]: Grade[]
}

export interface AttendanceRecord {
  date: string
  status: "present" | "absent" | "late"
  subject: string
  teacher: string
  notes?: string
}

export interface Assignment {
  id: string
  title: string
  description: string
  subject: string
  dueDate: string
  createdBy: string
  createdAt: string
}

export interface AssignmentSubmission {
  assignmentId: string
  studentId: string
  status: "pending" | "submitted" | "late" | "graded"
  submittedAt?: string
  grade?: number
  feedback?: string
}

export interface Exam {
  id: string
  title: string
  subject: string
  date: string
  startTime: string
  endTime: string
  createdBy: string
}

import {
  authenticateUser,
  registerParent,
  addStudent as dbAddStudent,
  getAllStudents,
  getStudent,
  deleteStudent as dbDeleteStudent,
  addGrade as dbAddGrade,
  getStudentGrades,
  getAllTeachers,
  getAllParents,
  addAttendance as dbAddAttendance,
  getStudentAttendance,
  createAssignment as dbCreateAssignment,
  getAssignmentsBySubject,
  getAllAssignments,
  updateSubmissionStatus as dbUpdateSubmissionStatus,
  getStudentSubmissions,
  calculateGPA as dbCalculateGPA,
  getStudentsByParent,
  createExam as dbCreateExam, // Import exam functions
  getExamsBySubject,
  getAllExams,
  deleteExam as dbDeleteExam,
  deleteAssignment as dbDeleteAssignment,
  createStudentAccount,
  loadDatabase,
  saveDatabase,
} from "./database"

export const apiClient = {
  // Auth
  async login(username: string, password: string): Promise<User | null> {
    const user = authenticateUser(username, password)
    return user
  },

  async register(username: string, password: string, name: string, profilePicture?: string): Promise<User | null> {
    const user = registerParent(username, password, name, profilePicture)
    return user
  },

  // Students
  async getStudents(): Promise<Student[]> {
    const students = getAllStudents()
    return students
  },

  async addStudent(name: string, surname: string, age: number, parentId: string): Promise<Student | null> {
    const student = dbAddStudent(name, surname, age, parentId)
    return student
  },

  async deleteStudent(studentId: string): Promise<boolean> {
    const success = dbDeleteStudent(studentId)
    return success
  },

  async getStudentProfile(studentId: string): Promise<{ student: Student; grades: StudentGrades } | null> {
    const student = getStudent(studentId)
    const grades = getStudentGrades(studentId)

    if (student && grades) {
      return { student, grades }
    }
    return null
  },

  // Grades
  async addGrade(
    studentId: string,
    subject: string,
    grade: number,
    teacher: string,
    comment?: string,
  ): Promise<Grade | null> {
    const gradeEntry = dbAddGrade(studentId, subject, grade, teacher, comment)
    return gradeEntry
  },

  // Attendance
  async addAttendance(
    studentId: string,
    status: "present" | "absent" | "late",
    subject: string,
    teacher: string,
    notes?: string,
  ): Promise<AttendanceRecord | null> {
    const record = dbAddAttendance(studentId, status, subject, teacher, notes)
    return record
  },

  async getAttendance(studentId: string): Promise<AttendanceRecord[]> {
    return getStudentAttendance(studentId)
  },

  // Assignments
  async createAssignment(
    title: string,
    description: string,
    subject: string,
    dueDate: string,
    createdBy: string,
  ): Promise<Assignment | null> {
    const assignment = dbCreateAssignment(title, description, subject, dueDate, createdBy)
    return assignment
  },

  async getAssignmentsBySubject(subject: string): Promise<Assignment[]> {
    return getAssignmentsBySubject(subject)
  },

  async getAllAssignments(): Promise<Assignment[]> {
    return getAllAssignments()
  },

  async updateSubmission(
    studentId: string,
    assignmentId: string,
    status: "pending" | "submitted" | "late" | "graded",
    grade?: number,
    feedback?: string,
  ): Promise<AssignmentSubmission | null> {
    const submission = dbUpdateSubmissionStatus(studentId, assignmentId, status, grade, feedback)
    return submission
  },

  async getSubmissions(studentId: string): Promise<AssignmentSubmission[]> {
    return getStudentSubmissions(studentId)
  },

  // GPA Calculation
  async calculateGPA(studentId: string): Promise<number> {
    return dbCalculateGPA(studentId)
  },

  // Messages
  async sendMessage(from: string, to: string, subject: string, content: string): Promise<any | null> {
    const db = loadDatabase()
    const messageId = `msg_${Date.now()}`

    const message = {
      id: messageId,
      from,
      to,
      subject,
      content,
      timestamp: new Date().toISOString(),
      read: false,
      replies: [],
    }

    db.messages = db.messages || {}
    db.messages[messageId] = message
    saveDatabase(db)
    return message
  },

  async getMessages(username: string): Promise<any[]> {
    const db = loadDatabase()
    if (!db.messages) return []

    return Object.values(db.messages).filter((msg: any) => msg.from === username || msg.to === username)
  },

  async replyToMessage(messageId: string, from: string, content: string): Promise<any | null> {
    const db = loadDatabase()

    if (!db.messages || !db.messages[messageId]) {
      return null
    }

    const reply = {
      id: `reply_${Date.now()}`,
      from,
      content,
      timestamp: new Date().toISOString(),
    }

    db.messages[messageId].replies.push(reply)
    saveDatabase(db)
    return reply
  },

  async markMessageAsRead(messageId: string): Promise<void> {
    const db = loadDatabase()
    if (db.messages && db.messages[messageId]) {
      db.messages[messageId].read = true
      saveDatabase(db)
    }
  },

  async deleteMessage(messageId: string): Promise<boolean> {
    const db = loadDatabase()
    if (db.messages && db.messages[messageId]) {
      delete db.messages[messageId]
      saveDatabase(db)
      return true
    }
    return false
  },

  async createStudentAccount(studentId: string, studentUsername: string, studentPassword: string): Promise<boolean> {
    return createStudentAccount(studentId, studentUsername, studentPassword)
  },

  // Messaging functions are already included above

  async getAllTeachers(): Promise<User[]> {
    return getAllTeachers()
  },

  async getAllParents(): Promise<User[]> {
    return getAllParents()
  },

  async getStudentsByParent(parentUsername: string): Promise<Student[]> {
    const students = getStudentsByParent(parentUsername)
    return students
  },

  async createExam(
    title: string,
    subject: string,
    date: string,
    startTime: string,
    endTime: string,
    createdBy: string,
  ): Promise<Exam | null> {
    const exam = dbCreateExam(title, subject, date, startTime, endTime, createdBy)
    return exam
  },

  async getExamsBySubject(subject: string): Promise<Exam[]> {
    return getExamsBySubject(subject)
  },

  async getAllExams(): Promise<Exam[]> {
    return getAllExams()
  },

  async deleteExam(examId: string): Promise<boolean> {
    return dbDeleteExam(examId)
  },

  async deleteAssignment(assignmentId: string): Promise<boolean> {
    return dbDeleteAssignment(assignmentId)
  },
}
