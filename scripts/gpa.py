import json
import sys
from database import load_db

def calculate_gpa(student_id: str):
    """Calculate GPA for a student based on all grades"""
    db = load_db()
    
    if student_id not in db.get("grades", {}):
        return json.dumps({"gpa": 0.0, "subjects": {}})
    
    grades = db["grades"][student_id]
    
    subject_averages = {}
    total_points = 0
    total_subjects = 0
    
    for subject, grade_list in grades.items():
        if len(grade_list) > 0:
            average = sum(g["grade"] for g in grade_list) / len(grade_list)
            subject_averages[subject] = round(average, 2)
            total_points += average
            total_subjects += 1
    
    gpa = round(total_points / total_subjects, 2) if total_subjects > 0 else 0.0
    
    return json.dumps({
        "gpa": gpa,
        "subjects": subject_averages,
        "totalSubjects": total_subjects
    })

def get_class_average(subject: str):
    """Calculate class average for a subject"""
    db = load_db()
    
    all_grades = []
    for student_id, grades in db.get("grades", {}).items():
        if subject in grades:
            for grade_entry in grades[subject]:
                all_grades.append(grade_entry["grade"])
    
    if len(all_grades) == 0:
        return json.dumps({"average": 0.0, "count": 0})
    
    average = sum(all_grades) / len(all_grades)
    
    return json.dumps({
        "average": round(average, 2),
        "count": len(all_grades)
    })

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No command provided"}))
        sys.exit(1)
    
    command = sys.argv[1]
    
    try:
        if command == "calculate":
            result = calculate_gpa(sys.argv[2])
        elif command == "class_average":
            result = get_class_average(sys.argv[2])
        else:
            result = json.dumps({"error": "Unknown command"})
        
        print(result)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
