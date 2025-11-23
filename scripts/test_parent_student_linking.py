#!/usr/bin/env python3
"""
Test script to verify parent-student linking functionality.
This demonstrates how the parent-student relationship system works.
"""

import json
from datetime import datetime
from typing import TypedDict, List

class Student(TypedDict):
    id: str
    name: str
    surname: str
    age: int
    parentId: str
    createdAt: str

class Parent(TypedDict):
    username: str
    name: str
    role: str

def create_test_students() -> List[Student]:
    """Create test students linked to specific parents."""
    students = [
        {
            "id": "student_001",
            "name": "Emma",
            "surname": "Johnson",
            "age": 14,
            "parentId": "john_parent",
            "createdAt": datetime.now().isoformat()
        },
        {
            "id": "student_002",
            "name": "Michael",
            "surname": "Johnson",
            "age": 12,
            "parentId": "john_parent",
            "createdAt": datetime.now().isoformat()
        },
        {
            "id": "student_003",
            "name": "Sarah",
            "surname": "Smith",
            "age": 15,
            "parentId": "sarah_parent",
            "createdAt": datetime.now().isoformat()
        },
        {
            "id": "student_004",
            "name": "Alex",
            "surname": "Williams",
            "age": 13,
            "parentId": "alex_parent",
            "createdAt": datetime.now().isoformat()
        }
    ]
    return students

def filter_students_by_parent(students: List[Student], parent_id: str) -> List[Student]:
    """Filter students to show only those belonging to a specific parent."""
    return [s for s in students if s["parentId"] == parent_id]

def get_parent_children_count(students: List[Student], parent_id: str) -> int:
    """Get count of children for a parent."""
    return len(filter_students_by_parent(students, parent_id))

def test_parent_student_filtering():
    """Test that parent filtering works correctly."""
    print("=" * 60)
    print("Parent-Student Linking Test")
    print("=" * 60)
    
    # Create test data
    students = create_test_students()
    test_parents = [
        {"username": "john_parent", "name": "John Johnson"},
        {"username": "sarah_parent", "name": "Sarah Smith"},
        {"username": "alex_parent", "name": "Alex Williams"}
    ]
    
    print("\nAll Students Created:")
    print("-" * 60)
    for student in students:
        print(f"  {student['name']} {student['surname']} -> Parent: {student['parentId']}")
    
    print("\n\nParent Access Test:")
    print("-" * 60)
    
    # Test filtering for each parent
    for parent in test_parents:
        parent_id = parent["username"]
        children = filter_students_by_parent(students, parent_id)
        child_count = len(children)
        
        print(f"\n{parent['name']} ({parent_id}):")
        print(f"  - Can see {child_count} child(ren)")
        
        if children:
            for child in children:
                print(f"    • {child['name']} {child['surname']} (Age: {child['age']})")
        else:
            print("    • No children assigned")
    
    print("\n\nAccess Control Verification:")
    print("-" * 60)
    
    # Verify john_parent can only see their 2 children
    john_students = filter_students_by_parent(students, "john_parent")
    assert len(john_students) == 2, "john_parent should have 2 children"
    assert all(s["parentId"] == "john_parent" for s in john_students), "All should belong to john_parent"
    print("✓ john_parent correctly sees only their 2 children")
    
    # Verify sarah_parent can only see their 1 child
    sarah_students = filter_students_by_parent(students, "sarah_parent")
    assert len(sarah_students) == 1, "sarah_parent should have 1 child"
    assert sarah_students[0]["name"] == "Sarah", "Should be Sarah"
    print("✓ sarah_parent correctly sees only their 1 child")
    
    # Verify alex_parent can only see their 1 child
    alex_students = filter_students_by_parent(students, "alex_parent")
    assert len(alex_students) == 1, "alex_parent should have 1 child"
    print("✓ alex_parent correctly sees only their 1 child")
    
    # Verify unauthorized parent sees nothing
    unauthorized_students = filter_students_by_parent(students, "unauthorized_parent")
    assert len(unauthorized_students) == 0, "Unauthorized parent should see no students"
    print("✓ Unauthorized parent sees no students")
    
    print("\n" + "=" * 60)
    print("All tests passed! Parent-student filtering works correctly.")
    print("=" * 60)

if __name__ == "__main__":
    test_parent_student_filtering()
