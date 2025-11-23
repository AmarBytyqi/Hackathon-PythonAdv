// Database simulation with localStorage
export interface User {
  username: string
  password: string
  role: "teacher" | "parent" | "student"
  name: string
  subject?: string
  profilePicture?: string
  studentId?: string
}

export interface Student {
  id: string
  name: string
  surname: string
  age: number
  parentId: string // Added parentId to link students to parents
  username?: string
  createdAt: string
}

export interface Grade {
  grade: number
  teacher: string
  date: string
  comment?: string // Added comment field for teacher feedback
}

export interface Message {
  id: string
  from: string
  fromRole: "teacher" | "parent"
  to: string
  toRole: "teacher" | "parent"
  subject: string
  content: string
  timestamp: string
  read: boolean
  replies: MessageReply[]
}

export interface MessageReply {
  id: string
  from: string
  fromRole: "teacher" | "parent"
  content: string
  timestamp: string
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
  createdAt: string
}

export interface Database {
  users: Record<string, User>
  students: Record<string, Student>
  grades: Record<string, Record<string, Grade[]>>
  messages: Record<string, Message>
  attendance: Record<string, AttendanceRecord[]>
  assignments: Record<string, Assignment>
  submissions: Record<string, AssignmentSubmission[]>
  exams: Record<string, Exam> // Added exams to database structure
}

// Initialize database with 10 teacher accounts
export const initDatabase = (): Database => {
  const teachers: Record<string, User> = {
    EnglishTeacher: {
      username: "EnglishTeacher",
      password: "English",
      role: "teacher",
      subject: "English",
      name: "English Teacher",
    },
    MathTeacher: {
      username: "MathTeacher",
      password: "Math",
      role: "teacher",
      subject: "Math",
      name: "Math Teacher",
    },
    BiologyTeacher: {
      username: "BiologyTeacher",
      password: "Biology",
      role: "teacher",
      subject: "Biology",
      name: "Biology Teacher",
    },
    ChemistryTeacher: {
      username: "ChemistryTeacher",
      password: "Chemistry",
      role: "teacher",
      subject: "Chemistry",
      name: "Chemistry Teacher",
    },
    PhysicsTeacher: {
      username: "PhysicsTeacher",
      password: "Physics",
      role: "teacher",
      subject: "Physics",
      name: "Physics Teacher",
    },
    HistoryTeacher: {
      username: "HistoryTeacher",
      password: "History",
      role: "teacher",
      subject: "History",
      name: "History Teacher",
    },
    GeographyTeacher: {
      username: "GeographyTeacher",
      password: "Geography",
      role: "teacher",
      subject: "Geography",
      name: "Geography Teacher",
    },
    ComputerScienceTeacher: {
      username: "ComputerScienceTeacher",
      password: "ComputerScience",
      role: "teacher",
      subject: "Computer Science",
      name: "Computer Science Teacher",
    },
    ArtTeacher: {
      username: "ArtTeacher",
      password: "Art",
      role: "teacher",
      subject: "Art",
      name: "Art Teacher",
    },
    PhysicalEducationTeacher: {
      username: "PhysicalEducationTeacher",
      password: "PhysicalEducation",
      role: "teacher",
      subject: "Physical Education",
      name: "Physical Education Teacher",
    },
  }

  return {
    users: teachers,
    students: {},
    grades: {},
    messages: {},
    attendance: {},
    assignments: {},
    submissions: {},
    exams: {}, // Initialize exams object
  }
}

export const loadDatabase = (): Database => {
  if (typeof window === "undefined") {
    // Server-side: return a minimal database structure
    // The actual storage happens client-side
    return initDatabase()
  }

  const stored = localStorage.getItem("gradeTrackerDB")
  if (!stored) {
    const db = initDatabase()
    localStorage.setItem("gradeTrackerDB", JSON.stringify(db))
    return db
  }

  const db = JSON.parse(stored) as Database
  if (!db.messages) {
    db.messages = {}
  }
  if (!db.attendance) {
    db.attendance = {}
  }
  if (!db.assignments) {
    db.assignments = {}
  }
  if (!db.submissions) {
    db.submissions = {}
  }
  if (!db.exams) {
    db.exams = {} // Initialize exams if missing
  }
  saveDatabase(db)
  return db
}

export const saveDatabase = (db: Database): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("gradeTrackerDB", JSON.stringify(db))
}

// User operations
export const authenticateUser = (username: string, password: string): Omit<User, "password"> | null => {
  const db = loadDatabase()
  const user = db.users[username]

  if (user && user.password === password) {
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  return null
}

export const registerParent = (
  username: string,
  password: string,
  name: string,
  profilePicture?: string,
): Omit<User, "password"> | null => {
  const db = loadDatabase()

  if (db.users[username]) {
    return null
  }

  db.users[username] = {
    username,
    password,
    role: "parent",
    name,
    profilePicture,
  }

  saveDatabase(db)

  return {
    username,
    role: "parent",
    name,
    profilePicture,
  }
}

export const createStudentAccount = (studentId: string, studentUsername: string, studentPassword: string): boolean => {
  const db = loadDatabase()

  // Check if username already exists
  if (db.users[studentUsername]) {
    return false
  }

  const student = db.students[studentId]
  if (!student) {
    return false
  }

  // Create student user account
  db.users[studentUsername] = {
    username: studentUsername,
    password: studentPassword,
    role: "student",
    name: `${student.name} ${student.surname}`,
    studentId: studentId,
  }

  // Link student to their username
  student.username = studentUsername

  saveDatabase(db)
  return true
}

// Student operations
export const addStudent = (
  name: string,
  surname: string,
  age: number,
  parentId: string,
  username?: string,
): Student => {
  const db = loadDatabase()

  const studentId = `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const student: Student = {
    id: studentId,
    name,
    surname,
    age,
    parentId,
    username,
    createdAt: new Date().toISOString(),
  }

  db.students[studentId] = student

  // Initialize grades for all subjects
  db.grades[studentId] = {
    English: [],
    Math: [],
    Biology: [],
    Chemistry: [],
    Physics: [],
    History: [],
    Geography: [],
    "Computer Science": [],
    Art: [],
    "Physical Education": [],
  }

  // If username provided, create student account
  if (username) {
    createStudentAccount(studentId, username, "")
  }

  saveDatabase(db)
  return student
}

export const getAllStudents = (): Student[] => {
  const db = loadDatabase()
  return Object.values(db.students)
}

export const getStudent = (studentId: string): Student | null => {
  const db = loadDatabase()
  return db.students[studentId] || null
}

export const deleteStudent = (studentId: string): boolean => {
  const db = loadDatabase()

  if (db.students[studentId]) {
    const student = db.students[studentId]
    if (student.username) {
      delete db.users[student.username]
    }
    delete db.students[studentId]
    delete db.grades[studentId]
    delete db.attendance[studentId]
    delete db.submissions[studentId]
    saveDatabase(db)
    return true
  }
  return false
}

// Grade operations
export const addGrade = (
  studentId: string,
  subject: string,
  grade: number,
  teacher: string,
  comment?: string,
): Grade | null => {
  const db = loadDatabase()

  if (!db.grades[studentId]) {
    return null
  }

  const gradeEntry: Grade = {
    grade,
    teacher,
    date: new Date().toISOString(),
    comment,
  }

  db.grades[studentId][subject].push(gradeEntry)
  saveDatabase(db)

  return gradeEntry
}

export const getStudentGrades = (studentId: string): Record<string, Grade[]> | null => {
  const db = loadDatabase()
  return db.grades[studentId] || null
}

// Attendance operations
export const addAttendance = (
  studentId: string,
  status: "present" | "absent" | "late",
  subject: string,
  teacher: string,
  notes?: string,
): AttendanceRecord => {
  const db = loadDatabase()

  if (!db.attendance[studentId]) {
    db.attendance[studentId] = []
  }

  const record: AttendanceRecord = {
    date: new Date().toISOString(),
    status,
    subject,
    teacher,
    notes,
  }

  db.attendance[studentId].push(record)
  saveDatabase(db)

  return record
}

export const getStudentAttendance = (studentId: string): AttendanceRecord[] => {
  const db = loadDatabase()
  return db.attendance[studentId] || []
}

// Assignment operations
export const createAssignment = (
  title: string,
  description: string,
  subject: string,
  dueDate: string,
  createdBy: string,
): Assignment => {
  const db = loadDatabase()

  const assignmentId = `assignment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const assignment: Assignment = {
    id: assignmentId,
    title,
    description,
    subject,
    dueDate,
    createdBy,
    createdAt: new Date().toISOString(),
  }

  db.assignments[assignmentId] = assignment
  saveDatabase(db)

  return assignment
}

export const getAssignmentsBySubject = (subject: string): Assignment[] => {
  const db = loadDatabase()
  return Object.values(db.assignments).filter((a) => a.subject === subject)
}

export const getAllAssignments = (): Assignment[] => {
  const db = loadDatabase()
  return Object.values(db.assignments)
}

export const deleteAssignment = (assignmentId: string): boolean => {
  const db = loadDatabase()
  if (db.assignments[assignmentId]) {
    delete db.assignments[assignmentId]
    // Also delete all submissions for this assignment
    Object.keys(db.submissions).forEach((studentId) => {
      db.submissions[studentId] = db.submissions[studentId].filter((s) => s.assignmentId !== assignmentId)
    })
    saveDatabase(db)
    return true
  }
  return false
}

// Submission operations
export const updateSubmissionStatus = (
  studentId: string,
  assignmentId: string,
  status: "pending" | "submitted" | "late" | "graded",
  grade?: number,
  feedback?: string,
): AssignmentSubmission => {
  const db = loadDatabase()

  if (!db.submissions[studentId]) {
    db.submissions[studentId] = []
  }

  const existingIndex = db.submissions[studentId].findIndex((s) => s.assignmentId === assignmentId)

  const submission: AssignmentSubmission = {
    assignmentId,
    studentId,
    status,
    submittedAt: status === "submitted" || status === "late" ? new Date().toISOString() : undefined,
    grade,
    feedback,
  }

  if (existingIndex >= 0) {
    db.submissions[studentId][existingIndex] = submission
  } else {
    db.submissions[studentId].push(submission)
  }

  saveDatabase(db)
  return submission
}

export const getStudentSubmissions = (studentId: string): AssignmentSubmission[] => {
  const db = loadDatabase()
  return db.submissions[studentId] || []
}

// GPA calculation
export const calculateGPA = (studentId: string): number => {
  const db = loadDatabase()
  const grades = db.grades[studentId]

  if (!grades) return 0

  let totalPoints = 0
  let totalSubjects = 0

  Object.values(grades).forEach((subjectGrades) => {
    if (subjectGrades.length > 0) {
      const average = subjectGrades.reduce((sum, g) => sum + g.grade, 0) / subjectGrades.length
      totalPoints += average
      totalSubjects++
    }
  })

  return totalSubjects > 0 ? totalPoints / totalSubjects : 0
}

export const getAllTeachers = (): User[] => {
  const db = loadDatabase()
  return Object.values(db.users).filter((user) => user.role === "teacher")
}

export const getAllParents = (): User[] => {
  const db = loadDatabase()
  return Object.values(db.users).filter((user) => user.role === "parent")
}

export const sendMessage = (
  from: string,
  fromRole: "teacher" | "parent",
  to: string,
  toRole: "teacher" | "parent",
  subject: string,
  content: string,
): Message => {
  const db = loadDatabase()

  const messageId = `message_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const message: Message = {
    id: messageId,
    from,
    fromRole,
    to,
    toRole,
    subject,
    content,
    timestamp: new Date().toISOString(),
    read: false,
    replies: [],
  }

  db.messages[messageId] = message
  saveDatabase(db)
  return message
}

export const replyToMessage = (
  messageId: string,
  from: string,
  fromRole: "teacher" | "parent",
  content: string,
): MessageReply | null => {
  const db = loadDatabase()

  if (!db.messages[messageId]) {
    return null
  }

  const replyId = `reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const reply: MessageReply = {
    id: replyId,
    from,
    fromRole,
    content,
    timestamp: new Date().toISOString(),
  }

  db.messages[messageId].replies.push(reply)
  saveDatabase(db)

  return reply
}

export const getMessagesForUser = (username: string): Message[] => {
  const db = loadDatabase()
  if (!db.messages) {
    return []
  }
  return Object.values(db.messages).filter((msg) => msg.from === username || msg.to === username)
}

export const markMessageAsRead = (messageId: string): void => {
  const db = loadDatabase()
  if (db.messages[messageId]) {
    db.messages[messageId].read = true
    saveDatabase(db)
  }
}

export const deleteMessage = (messageId: string): boolean => {
  const db = loadDatabase()
  if (db.messages[messageId]) {
    delete db.messages[messageId]
    saveDatabase(db)
    return true
  }
  return false
}

export const getStudentsByParent = (parentUsername: string): Student[] => {
  const db = loadDatabase()
  return Object.values(db.students).filter((student) => student.parentId === parentUsername)
}

// Exam operations
export const createExam = (
  title: string,
  subject: string,
  date: string,
  startTime: string,
  endTime: string,
  createdBy: string,
): Exam => {
  const db = loadDatabase()

  const examId = `exam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const exam: Exam = {
    id: examId,
    title,
    subject,
    date,
    startTime,
    endTime,
    createdBy,
    createdAt: new Date().toISOString(),
  }

  db.exams[examId] = exam
  saveDatabase(db)

  return exam
}

export const getExamsBySubject = (subject: string): Exam[] => {
  const db = loadDatabase()
  return Object.values(db.exams).filter((e) => e.subject === subject)
}

export const getAllExams = (): Exam[] => {
  const db = loadDatabase()
  return Object.values(db.exams)
}

export const deleteExam = (examId: string): boolean => {
  const db = loadDatabase()
  if (db.exams[examId]) {
    delete db.exams[examId]
    saveDatabase(db)
    return true
  }
  return false
}
