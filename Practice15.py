# Program to find the greatest of 3 numbers entered by the user! 

# Difficulty : Hard / Bare Minimum Medium

num1 = int(input("Enter 1st Number: "))
num2 = int(input("Enter 2nd Number: "))
num3 = int(input("Enter 3rd Number: ")) 

if (num1 >= num2 and num1 >= num3):
    print("Greatest: ", num1)
elif(num2 >= num1 and num2 >= num3):
    print("Greatest: ", num2)
else: 
    print("Greatest: ", num3)
    