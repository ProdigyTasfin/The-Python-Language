# Program to check if a list contains a palindrome of elements. 

number = []

for i in range(3):
    num = int(input("Enter Numbers"))
    number.append(num)

# copy_List = number.copy()
# number.reverse()

if number == number[::-1]: #trick to reverse any list without changing the original 
    print("This is a Palindrome!")
else:
    print("This is not a Palindrome!")

print(number) 