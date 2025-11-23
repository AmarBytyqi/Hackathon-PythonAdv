import json
import os
from datetime import datetime
from typing import Optional, Dict, List, Any

# Data file path
DATA_FILE = "data/database.json"

# Initialize database structure
def init_db():
    """Initialize the database with teacher accounts and empty collections"""
    
    # Teacher accounts (10 subjects)
    teachers = {
        "EnglishTeacher": {
            "username": "EnglishTeacher",
            "password": "English",
            "role": "teacher",
            "subject": "English",
            "name": "English Teacher"
        },
        "MathTeacher": {
            "username": "MathTeacher",
            "password": "Math",
            "role": "teacher",
            "subject": "Math",
            "name": "Math Teacher"
        },
        "BiologyTeacher": {
            "username": "BiologyTeacher",
            "password": "Biology",
            "role": "teacher",
            "subject": "Biology",
            "name": "Biology Teacher"
        },
        "ChemistryTeacher": {
            "username": "ChemistryTeacher",
            "password": "Chemistry",
            "role": "teacher",
            "subject": "Chemistry",
            "name": "Chemistry Teacher"
        },
        "PhysicsTeacher": {
            "username": "PhysicsTeacher",
            "password": "Physics",
            "role": "teacher",
            "subject": "Physics",
            "name": "Physics Teacher"
        },
        "HistoryTeacher": {
            "username": "HistoryTeacher",
            "password": "History",
            "role": "teacher",
            "subject": "History",
            "name": "History Teacher"
        },
        "GeographyTeacher": {
            "username": "GeographyTeacher",
            "password": "Geography",
            "role": "teacher",
            "subject": "Geography",
            "name": "Geography Teacher"
        },
        "ComputerScienceTeacher": {
            "username": "ComputerScienceTeacher",
            "password": "ComputerScience",
            "role": "teacher",
            "subject": "Computer Science",
            "name": "Computer Science Teacher"
        },
        "ArtTeacher": {
            "username": "ArtTeacher",
            "password": "Art",
            "role": "teacher",
            "subject": "Art",
            "name": "Art Teacher"
        },
        "PhysicalEducationTeacher": {
            "username": "PhysicalEducationTeacher",
            "password": "PhysicalEducation",
            "role": "teacher",
            "subject": "Physical Education",
            "name": "Physical Education Teacher"
        }
    }
    
    db_structure = {
        "users": teachers,
        "students": {},
        "grades": {}
    }
    
    # Create data directory if it doesn't exist
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    
    # Write initial data
    with open(DATA_FILE, 'w') as f:
        json.dump(db_structure, f, indent=2)
    
    print("Database initialized successfully!")
    return db_structure

def load_db() -> Dict:
    """Load database from file"""
    if not os.path.exists(DATA_FILE):
        return init_db()
    
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def save_db(db: Dict):
    """Save database to file"""
    with open(DATA_FILE, 'w') as f:
        json.dump(db, f, indent=2)

# User operations
def authenticate_user(username: str, password: str) -> Optional[Dict]:
    """Authenticate a user"""
    db = load_db()
    user = db["users"].get(username)
    
    if user and user["password"] == password:
        return {
            "username": user["username"],
            "role": user["role"],
            "name": user["name"],
            "subject": user.get("subject")
        }
    return None

def register_parent(username: str, password: str, name: str) -> Optional[Dict]:
    """Register a new parent user"""
    db = load_db()
    
    if username in db["users"]:
        return None
    
    db["users"][username] = {
        "username": username,
        "password": password,
        "role": "parent",
        "name": name
    }
    
    save_db(db)
    
    return {
        "username": username,
        "role": "parent",
        "name": name
    }

# Student operations
def add_student(name: str, surname: str, age: int) -> Dict:
    """Add a new student"""
    db = load_db()
    
    # Generate student ID
    student_id = f"student_{len(db['students']) + 1}"
    
    student = {
        "id": student_id,
        "name": name,
        "surname": surname,
        "age": age,
        "created_at": datetime.now().isoformat()
    }
    
    db["students"][student_id] = student
    
    # Initialize grades for this student
    db["grades"][student_id] = {
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
    
    save_db(db)
    return student

def get_all_students() -> List[Dict]:
    """Get all students"""
    db = load_db()
    return list(db["students"].values())

def get_student(student_id: str) -> Optional[Dict]:
    """Get a specific student"""
    db = load_db()
    return db["students"].get(student_id)

def delete_student(student_id: str) -> bool:
    """Delete a student"""
    db = load_db()
    
    if student_id in db["students"]:
        del db["students"][student_id]
        if student_id in db["grades"]:
            del db["grades"][student_id]
        save_db(db)
        return True
    return False

# Grade operations
def add_grade(student_id: str, subject: str, grade: float, teacher: str, comment: str = "") -> Dict:
    """Add a grade for a student in a subject"""
    db = load_db()
    
    if student_id not in db["grades"]:
        return None
    
    grade_entry = {
        "grade": grade,
        "teacher": teacher,
        "date": datetime.now().isoformat(),
        "comment": comment
    }
    
    db["grades"][student_id][subject].append(grade_entry)
    save_db(db)
    
    return grade_entry

def get_student_grades(student_id: str) -> Optional[Dict]:
    """Get all grades for a student"""
    db = load_db()
    return db["grades"].get(student_id)

if __name__ == "__main__":
    # Initialize database when script is run
    init_db()
