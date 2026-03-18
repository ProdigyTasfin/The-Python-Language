# Program to enter marks of 3 subjects from the user and store them in a dictionary. Start with
# an empty dictionary and add one by one. Use subject name as key and marks as value. 

# Difficulty : Bare Minimum Hard

subjects = {}

for i in range(3):
    subject = input("Enter subject name: ")
    marks = int(input("Enter marks: "))

    subjects[subject] = marks

print("Final Dictionary:", subjects)