#  Program that calculates factorial of a number. 

# Difficulty: Bare Minimum Medium / Hard

number = int(input("Enter a number: "))

factorial = 1

for i in range(1, number + 1):
    factorial = factorial * i

print("Factorial is:", factorial)