import json
import sys
from datetime import datetime
from database import load_db, save_db

def add_attendance(student_id: str, status: str, subject: str, teacher: str, notes: str = ""):
    """Add attendance record for a student"""
    db = load_db()
    
    if "attendance" not in db:
        db["attendance"] = {}
    
    if student_id not in db["attendance"]:
        db["attendance"][student_id] = []
    
    record = {
        "date": datetime.now().isoformat(),
        "status": status,
        "subject": subject,
        "teacher": teacher,
        "notes": notes
    }
    
    db["attendance"][student_id].append(record)
    save_db(db)
    
    return json.dumps(record)

def get_attendance(student_id: str):
    """Get all attendance records for a student"""
    db = load_db()
    
    if "attendance" not in db:
        return json.dumps([])
    
    return json.dumps(db["attendance"].get(student_id, []))

def get_attendance_stats(student_id: str, subject: str = None):
    """Calculate attendance statistics"""
    db = load_db()
    
    if "attendance" not in db or student_id not in db["attendance"]:
        return json.dumps({"present": 0, "absent": 0, "late": 0, "total": 0, "percentage": 0})
    
    records = db["attendance"][student_id]
    
    if subject:
        records = [r for r in records if r["subject"] == subject]
    
    stats = {
        "present": sum(1 for r in records if r["status"] == "present"),
        "absent": sum(1 for r in records if r["status"] == "absent"),
        "late": sum(1 for r in records if r["status"] == "late"),
        "total": len(records)
    }
    
    if stats["total"] > 0:
        stats["percentage"] = round((stats["present"] / stats["total"]) * 100, 2)
    else:
        stats["percentage"] = 0
    
    return json.dumps(stats)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No command provided"}))
        sys.exit(1)
    
    command = sys.argv[1]
    
    try:
        if command == "add":
            result = add_attendance(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6] if len(sys.argv) > 6 else "")
        elif command == "get":
            result = get_attendance(sys.argv[2])
        elif command == "stats":
            result = get_attendance_stats(sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None)
        else:
            result = json.dumps({"error": "Unknown command"})
        
        print(result)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
