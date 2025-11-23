# Student Grade Tracker

A comprehensive student grade tracking system with separate portals for teachers and parents, powered by a Python backend.

## Features

### Teacher Portal
- 10 pre-configured teacher accounts (one per subject)
- Add and manage students
- View student cards with name, surname, and age
- Add grades only for their assigned subject
- View detailed student profiles with grade visualizations

### Parent Portal
- Custom registration for parent accounts
- View-only access to all students
- View student grades across all subjects
- Access to grade visualizations

### Student Profiles
- Comprehensive grade tracking across 10 subjects:
  - English
  - Math
  - Biology
  - Chemistry
  - Physics
  - History
  - Geography
  - Computer Science
  - Art
  - Physical Education
- 6 different chart types for visualizing grades:
  - Bar Chart
  - Pie Chart
  - Line Chart
  - Area Chart
  - Radar Chart
  - Scatter Plot

## Pre-configured Teacher Accounts

| Username | Password | Subject |
|----------|----------|---------|
| EnglishTeacher | English | English |
| MathTeacher | Math | Math |
| BiologyTeacher | Biology | Biology |
| ChemistryTeacher | Chemistry | Chemistry |
| PhysicsTeacher | Physics | Physics |
| HistoryTeacher | History | History |
| GeographyTeacher | Geography | Geography |
| ComputerScienceTeacher | ComputerScience | Computer Science |
| ArtTeacher | Art | Art |
| PhysicalEducationTeacher | PhysicalEducation | Physical Education |

## Backend Architecture

The application uses a **Python backend** for all data management:

### Python Scripts (`scripts/`)
- **auth.py** - User authentication and registration
  - Teacher account initialization
  - Parent registration
  - Login authentication
  - Data stored in `data/users.json`

- **students.py** - Student and grade management
  - Student CRUD operations
  - Grade management per subject
  - Data stored in `data/students.json` and `data/grades.json`

### Next.js API Routes (`app/api/`)
- **auth/** - Authentication endpoints that call Python auth scripts
- **students/** - Student management endpoints that call Python student scripts
- **grades/** - Grade management endpoints that call Python grade scripts

All API routes use `execSync` to execute Python scripts and return results.

### Data Storage
All data is stored in separate JSON files in the `data/` directory:
\`\`\`json
// data/users.json
{
  "EnglishTeacher": { "username": "...", "password": "...", "role": "teacher", "subject": "English" },
  "parent123": { "username": "...", "password": "...", "role": "parent", "name": "..." }
}

// data/students.json
{
  "student_1": { "id": "...", "name": "...", "surname": "...", "age": ... }
}

// data/grades.json
{
  "student_1": {
    "English": [{ "grade": 85, "teacher": "EnglishTeacher", "date": "..." }],
    "Math": [...]
  }
}
\`\`\`

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.8+

### Installation

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Initialize the Python databases:
\`\`\`bash
python3 scripts/auth.py init
python3 scripts/students.py init
\`\`\`

This will create:
- `data/` directory
- `data/users.json` with 10 pre-configured teacher accounts
- `data/students.json` for student data
- `data/grades.json` for grade data

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000)

## Usage

### As a Teacher
1. Sign in with one of the pre-configured teacher accounts
2. Click "Add Student" to add new students
3. Click "View Profile" on any student card to see their grades
4. Add grades only for your subject using the "Add Grade" button
5. Select different chart types to visualize grade data

### As a Parent
1. Register a new account on the Register tab
2. View all students in the system
3. Click "View Profile" to see any student's grades
4. View grades across all subjects (read-only access)
5. Choose different chart visualizations

## API Endpoints

### Authentication
- `POST /api/auth/login` - Calls `python3 scripts/auth.py login`
- `POST /api/auth/register` - Calls `python3 scripts/auth.py register`

### Students
- `GET /api/students` - Calls `python3 scripts/students.py list`
- `POST /api/students` - Calls `python3 scripts/students.py add`
- `DELETE /api/students?id={id}` - Calls `python3 scripts/students.py delete`
- `GET /api/students/{id}` - Calls `python3 scripts/students.py get` and `get_grades`

### Grades
- `POST /api/grades` - Calls `python3 scripts/students.py add_grade`

## Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI component library
- **Recharts** - Data visualization

### Backend
- **Python 3** - Backend logic and data management
- **Node.js API Routes** - API layer bridging frontend to Python
- **JSON File Storage** - Data persistence with separate files

## Project Structure

\`\`\`
├── app/
│   ├── api/              # Next.js API routes (call Python scripts)
│   ├── teacher/          # Teacher dashboard
│   ├── parent/           # Parent dashboard
│   ├── student/          # Student profile pages
│   └── page.tsx          # Login/Register page
├── components/
│   ├── ui/               # shadcn UI components
│   ├── student-card.tsx
│   ├── add-student-dialog.tsx
│   ├── add-grade-dialog.tsx
│   └── grade-chart.tsx
├── lib/
│   ├── api-client.ts     # Frontend API client
│   └── database.ts       # Client-side database fallback
├── scripts/
│   ├── auth.py           # Python authentication logic
│   ├── students.py       # Python student/grade management
│   └── database.py       # Original combined database script
└── data/
    ├── users.json        # User accounts
    ├── students.json     # Student data
    └── grades.json       # Grade data
\`\`\`

## Permissions

- **Teachers** can:
  - Add/delete students
  - View all student profiles
  - Add grades ONLY for their assigned subject
  
- **Parents** can:
  - View all students
  - View grades across all subjects
  - Cannot modify any data

## Grade Visualization

Each subject displays:
- Average grade calculation
- Multiple chart types via dropdown:
  - **Bar Chart** - Compare grades side by side
  - **Pie Chart** - Visualize grade distribution
  - **Line Chart** - Track grade trends
  - **Area Chart** - Show grade progression
  - **Radar Chart** - Multi-dimensional view
  - **Scatter Plot** - Grade point distribution

## Notes

- Grades are stored as values from 0-100
- Each teacher can only add grades for their specific subject
- Parents have read-only access to all data
- The database automatically initializes with 10 teacher accounts
- All data persists in the JSON file between sessions

## Python CLI Usage

You can also interact with the Python backend directly:

### Authentication
\`\`\`bash
# Initialize auth database
python3 scripts/auth.py init

# Login
python3 scripts/auth.py login "EnglishTeacher" "English"

# Register parent
python3 scripts/auth.py register "parent123" "password" "John Doe"
\`\`\`

### Student Management
\`\`\`bash
# Initialize students database
python3 scripts/students.py init

# Add student
python3 scripts/students.py add "John" "Smith" 15

# List all students
python3 scripts/students.py list

# Get specific student
python3 scripts/students.py get "student_1"

# Delete student
python3 scripts/students.py delete "student_1"

# Add grade
python3 scripts/students.py add_grade "student_1" "English" 85 "EnglishTeacher"

# Get student grades
python3 scripts/students.py get_grades "student_1"
