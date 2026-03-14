#  Program that calculates factorial of a number. 

number = int(input("Enter Your Number: "))

for i in number:
    factorial = number * (number - i)
    print(factorial)