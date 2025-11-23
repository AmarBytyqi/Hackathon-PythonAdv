import json
import os
from datetime import datetime
from typing import Optional, Dict, List

# Data file paths
STUDENTS_FILE = "data/students.json"
GRADES_FILE = "data/grades.json"

def init_students_db():
    """Initialize students database"""
    os.makedirs(os.path.dirname(STUDENTS_FILE), exist_ok=True)
    
    with open(STUDENTS_FILE, 'w') as f:
        json.dump({}, f, indent=2)
    
    with open(GRADES_FILE, 'w') as f:
        json.dump({}, f, indent=2)

def load_students() -> Dict:
    """Load students from file"""
    if not os.path.exists(STUDENTS_FILE):
        init_students_db()
        return {}
    
    with open(STUDENTS_FILE, 'r') as f:
        return json.load(f)

def save_students(students: Dict):
    """Save students to file"""
    os.makedirs(os.path.dirname(STUDENTS_FILE), exist_ok=True)
    with open(STUDENTS_FILE, 'w') as f:
        json.dump(students, f, indent=2)

def load_grades() -> Dict:
    """Load grades from file"""
    if not os.path.exists(GRADES_FILE):
        init_students_db()
        return {}
    
    with open(GRADES_FILE, 'r') as f:
        return json.load(f)

def save_grades(grades: Dict):
    """Save grades to file"""
    os.makedirs(os.path.dirname(GRADES_FILE), exist_ok=True)
    with open(GRADES_FILE, 'w') as f:
        json.dump(grades, f, indent=2)

def create_student(name: str, surname: str, age: int) -> Dict:
    """Create a new student"""
    students = load_students()
    grades = load_grades()
    
    # Generate student ID
    student_id = f"student_{len(students) + 1}"
    
    student = {
        "id": student_id,
        "name": name,
        "surname": surname,
        "age": age,
        "created_at": datetime.now().isoformat()
    }
    
    students[student_id] = student
    save_students(students)
    
    # Initialize grades for this student
    grades[student_id] = {
        "English": [],
        "Math": [],
        "Biology": [],
        "Chemistry": [],
        "Physics": [],
        "History": [],
        "Geography": [],
        "Computer Science": [],
        "Art": [],
        "Physical Education": []
    }
    save_grades(grades)
    
    return student

def get_all_students() -> List[Dict]:
    """Get all students"""
    students = load_students()
    return list(students.values())

def get_student(student_id: str) -> Optional[Dict]:
    """Get a specific student"""
    students = load_students()
    return students.get(student_id)

def remove_student(student_id: str) -> bool:
    """Delete a student"""
    students = load_students()
    grades = load_grades()
    
    if student_id in students:
        del students[student_id]
        save_students(students)
        
        if student_id in grades:
            del grades[student_id]
            save_grades(grades)
        
        return True
    return False

def add_student_grade(student_id: str, subject: str, grade: float, teacher: str) -> Optional[Dict]:
    """Add a grade for a student"""
    grades = load_grades()
    
    if student_id not in grades:
        return None
    
    grade_entry = {
        "grade": grade,
        "teacher": teacher,
        "date": datetime.now().isoformat()
    }
    
    grades[student_id][subject].append(grade_entry)
    save_grades(grades)
    
    return grade_entry

def get_student_grades(student_id: str) -> Optional[Dict]:
    """Get all grades for a student"""
    grades = load_grades()
    return grades.get(student_id)

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python students.py <command> [args]")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "init":
        init_students_db()
        print(json.dumps({"success": True, "message": "Students database initialized"}))
    
    elif command == "add":
        if len(sys.argv) < 5:
            print(json.dumps({"success": False, "error": "Name, surname, and age required"}))
            sys.exit(1)
        
        name = sys.argv[2]
        surname = sys.argv[3]
        age = int(sys.argv[4])
        student = create_student(name, surname, age)
        print(json.dumps({"success": True, "student": student}))
    
    elif command == "list":
        students = get_all_students()
        print(json.dumps({"success": True, "students": students}))
    
    elif command == "get":
        if len(sys.argv) < 3:
            print(json.dumps({"success": False, "error": "Student ID required"}))
            sys.exit(1)
        
        student_id = sys.argv[2]
        student = get_student(student_id)
        
        if student:
            print(json.dumps({"success": True, "student": student}))
        else:
            print(json.dumps({"success": False, "error": "Student not found"}))
    
    elif command == "delete":
        if len(sys.argv) < 3:
            print(json.dumps({"success": False, "error": "Student ID required"}))
            sys.exit(1)
        
        student_id = sys.argv[2]
        success = remove_student(student_id)
        
        if success:
            print(json.dumps({"success": True, "message": "Student deleted"}))
        else:
            print(json.dumps({"success": False, "error": "Student not found"}))
    
    elif command == "add_grade":
        if len(sys.argv) < 6:
            print(json.dumps({"success": False, "error": "Student ID, subject, grade, and teacher required"}))
            sys.exit(1)
        
        student_id = sys.argv[2]
        subject = sys.argv[3]
        grade = float(sys.argv[4])
        teacher = sys.argv[5]
        
        grade_entry = add_student_grade(student_id, subject, grade, teacher)
        
        if grade_entry:
            print(json.dumps({"success": True, "grade": grade_entry}))
        else:
            print(json.dumps({"success": False, "error": "Failed to add grade"}))
    
    elif command == "get_grades":
        if len(sys.argv) < 3:
            print(json.dumps({"success": False, "error": "Student ID required"}))
            sys.exit(1)
        
        student_id = sys.argv[2]
        grades = get_student_grades(student_id)
        
        if grades:
            print(json.dumps({"success": True, "grades": grades}))
        else:
            print(json.dumps({"success": False, "error": "Student not found"}))
