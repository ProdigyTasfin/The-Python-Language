# Q: Write a Program to input side of a square and prints its area.
# Difficulty: Easy 

side = float(input("Enter side's value of your square: "))
area = side ** 2 # area = side * side area = (a^2)
print(f"Area: {area:.2f}") #formatted string

#older version print("Area: %.2f" % area)