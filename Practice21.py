# You are given a list of subjects for students. Assume one classroom is required for 1 subject. How many
# classrooms are needed by all students. 

# "Python", "Java", "C++", "Python", "JavaScript", "Java", "Python", "Java", "C++", "C" 

#Difficulty: Bare Minimum Medium / Easy 

subjects = [
    "Python", "Java", "C++", "Python",
    "JavaScript", "Java", "Python",
    "Java", "C++", "C"
]

unique_subjects = set(subjects)

print("Unique Subjects:", unique_subjects)
print("Number of Classrooms Needed:", len(unique_subjects))