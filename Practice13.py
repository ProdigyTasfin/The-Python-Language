""" Q: Grade students based on marks 

    marks >= 90, grade = "A" 
    90 > marks >= 80, grade = "B" 
    80 > marks >= 70, grade = "C" 
    70 > marks, grade = "D"  """ 

# Difficulty : Intermediate 

marks = int(input("Input Your Marks: "))

if marks >= 90 and marks <100:
    print("Congratulations! Your Grade is A")

elif(marks >= 80 and marks < 90):
    print("Your Grade is B")
# elif 90 > marks >= 80:
#     print("Your Grade is B")
elif 80 > marks >= 70:
    print("Your Grade is C")
elif (marks >= 60 and marks < 70):
    print("Your Grade is D")
else:
    print("Sorry! Your Grade is F")