# user gives a random alphabets, Program to store it into list and Sort "A" to "Z"

# Difficulty: Bare Minimum Medium / Easy

alphabet = []

for i in range(5):
    values = input("Enter Alphabets: ")
    alphabet.append(values)

alphabet.sort()

print("Your Sorted Alphabetic Series: ", alphabet)