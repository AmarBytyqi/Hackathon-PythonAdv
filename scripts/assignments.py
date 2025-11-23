import json
import sys
from datetime import datetime
from database import load_db, save_db

def create_assignment(title: str, description: str, subject: str, due_date: str, created_by: str):
    """Create a new assignment"""
    db = load_db()
    
    if "assignments" not in db:
        db["assignments"] = {}
    
    assignment_id = f"assignment_{datetime.now().timestamp()}_{id(object())}"
    
    assignment = {
        "id": assignment_id,
        "title": title,
        "description": description,
        "subject": subject,
        "dueDate": due_date,
        "createdBy": created_by,
        "createdAt": datetime.now().isoformat()
    }
    
    db["assignments"][assignment_id] = assignment
    save_db(db)
    
    return json.dumps(assignment)

def get_assignments_by_subject(subject: str):
    """Get all assignments for a subject"""
    db = load_db()
    
    if "assignments" not in db:
        return json.dumps([])
    
    assignments = [a for a in db["assignments"].values() if a["subject"] == subject]
    return json.dumps(assignments)

def get_all_assignments():
    """Get all assignments"""
    db = load_db()
    
    if "assignments" not in db:
        return json.dumps([])
    
    return json.dumps(list(db["assignments"].values()))

def update_submission(student_id: str, assignment_id: str, status: str, grade: float = None, feedback: str = ""):
    """Update assignment submission status"""
    db = load_db()
    
    if "submissions" not in db:
        db["submissions"] = {}
    
    if student_id not in db["submissions"]:
        db["submissions"][student_id] = []
    
    # Find existing submission
    submission = None
    for i, s in enumerate(db["submissions"][student_id]):
        if s["assignmentId"] == assignment_id:
            submission = db["submissions"][student_id][i]
            break
    
    if submission is None:
        submission = {
            "assignmentId": assignment_id,
            "studentId": student_id,
            "status": status,
            "submittedAt": None,
            "grade": None,
            "feedback": ""
        }
        db["submissions"][student_id].append(submission)
    
    submission["status"] = status
    if status in ["submitted", "late"]:
        submission["submittedAt"] = datetime.now().isoformat()
    if grade is not None:
        submission["grade"] = grade
    if feedback:
        submission["feedback"] = feedback
    
    save_db(db)
    return json.dumps(submission)

def get_student_submissions(student_id: str):
    """Get all submissions for a student"""
    db = load_db()
    
    if "submissions" not in db or student_id not in db["submissions"]:
        return json.dumps([])
    
    return json.dumps(db["submissions"][student_id])

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No command provided"}))
        sys.exit(1)
    
    command = sys.argv[1]
    
    try:
        if command == "create":
            result = create_assignment(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6])
        elif command == "get_by_subject":
            result = get_assignments_by_subject(sys.argv[2])
        elif command == "get_all":
            result = get_all_assignments()
        elif command == "update_submission":
            grade = float(sys.argv[5]) if len(sys.argv) > 5 and sys.argv[5] else None
            feedback = sys.argv[6] if len(sys.argv) > 6 else ""
            result = update_submission(sys.argv[2], sys.argv[3], sys.argv[4], grade, feedback)
        elif command == "get_submissions":
            result = get_student_submissions(sys.argv[2])
        else:
            result = json.dumps({"error": "Unknown command"})
        
        print(result)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
