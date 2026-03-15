# Program to count the number of students with the "A" grade in the following tuple. 

# Difficulty:  Bare Minimum Hard / Medium 

grades = []

number_ofStudents = int(input("Enter Number of Students: "))

for i in range(number_ofStudents):
    grade = input("Enter Grade: ")
    grades.append(grade)

tup = tuple(grades)

print("There are", tup.count("A"), "numbers of A")