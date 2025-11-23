export type UserRole = "teacher" | "parent" | "student"

export interface User {
  id: string
  username: string
  password: string
  role: UserRole
  name: string
  subject?: string // Only for teachers
  studentId?: string // Only for students - links to Student record
}

export interface Student {
  id: string
  name: string
  surname: string
  age: number
  parentId: string
  username?: string // Added username field for student login
  createdAt: string
}

export interface Grade {
  id: string
  studentId: string
  subject: string
  grade: number
  maxGrade: number
  date: string
  teacherId: string
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

export const SUBJECTS = [
  "English",
  "Math",
  "Biology",
  "Chemistry",
  "Physics",
  "History",
  "Geography",
  "Computer Science",
  "Art",
  "Physical Education",
] as const

export const TEACHERS: User[] = [
  {
    id: "1",
    username: "EnglishTeacher",
    password: "English",
    role: "teacher",
    name: "English Teacher",
    subject: "English",
  },
  { id: "2", username: "MathTeacher", password: "Math", role: "teacher", name: "Math Teacher", subject: "Math" },
  {
    id: "3",
    username: "BiologyTeacher",
    password: "Biology",
    role: "teacher",
    name: "Biology Teacher",
    subject: "Biology",
  },
  {
    id: "4",
    username: "ChemistryTeacher",
    password: "Chemistry",
    role: "teacher",
    name: "Chemistry Teacher",
    subject: "Chemistry",
  },
  {
    id: "5",
    username: "PhysicsTeacher",
    password: "Physics",
    role: "teacher",
    name: "Physics Teacher",
    subject: "Physics",
  },
  {
    id: "6",
    username: "HistoryTeacher",
    password: "History",
    role: "teacher",
    name: "History Teacher",
    subject: "History",
  },
  {
    id: "7",
    username: "GeographyTeacher",
    password: "Geography",
    role: "teacher",
    name: "Geography Teacher",
    subject: "Geography",
  },
  {
    id: "8",
    username: "ComputerScienceTeacher",
    password: "ComputerScience",
    role: "teacher",
    name: "CS Teacher",
    subject: "Computer Science",
  },
  { id: "9", username: "ArtTeacher", password: "Art", role: "teacher", name: "Art Teacher", subject: "Art" },
  {
    id: "10",
    username: "PETeacher",
    password: "PE",
    role: "teacher",
    name: "PE Teacher",
    subject: "Physical Education",
  },
]
