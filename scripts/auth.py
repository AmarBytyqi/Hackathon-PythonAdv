import json
import os
from typing import Optional, Dict

# Data file path
DATA_FILE = "data/users.json"

def init_auth_db():
    """Initialize authentication database with teacher accounts"""
    
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
    
    # Create data directory if it doesn't exist
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    
    # Write initial data
    with open(DATA_FILE, 'w') as f:
        json.dump(teachers, f, indent=2)
    
    return teachers

def load_users() -> Dict:
    """Load users from file"""
    if not os.path.exists(DATA_FILE):
        return init_auth_db()
    
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def save_users(users: Dict):
    """Save users to file"""
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, 'w') as f:
        json.dump(users, f, indent=2)

def authenticate(username: str, password: str) -> Optional[Dict]:
    """Authenticate a user with username and password"""
    users = load_users()
    user = users.get(username)
    
    if user and user["password"] == password:
        return {
            "username": user["username"],
            "role": user["role"],
            "name": user["name"],
            "subject": user.get("subject")
        }
    return None

def register_parent_user(username: str, password: str, name: str) -> Optional[Dict]:
    """Register a new parent user"""
    users = load_users()
    
    if username in users:
        return None
    
    users[username] = {
        "username": username,
        "password": password,
        "role": "parent",
        "name": name
    }
    
    save_users(users)
    
    return {
        "username": username,
        "role": "parent",
        "name": name
    }

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python auth.py <command> [args]")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "init":
        init_auth_db()
        print(json.dumps({"success": True, "message": "Database initialized"}))
    
    elif command == "login":
        if len(sys.argv) < 4:
            print(json.dumps({"success": False, "error": "Username and password required"}))
            sys.exit(1)
        
        username = sys.argv[2]
        password = sys.argv[3]
        user = authenticate(username, password)
        
        if user:
            print(json.dumps({"success": True, "user": user}))
        else:
            print(json.dumps({"success": False, "error": "Invalid credentials"}))
    
    elif command == "register":
        if len(sys.argv) < 5:
            print(json.dumps({"success": False, "error": "Username, password, and name required"}))
            sys.exit(1)
        
        username = sys.argv[2]
        password = sys.argv[3]
        name = sys.argv[4]
        user = register_parent_user(username, password, name)
        
        if user:
            print(json.dumps({"success": True, "user": user}))
        else:
            print(json.dumps({"success": False, "error": "Username already exists"}))
