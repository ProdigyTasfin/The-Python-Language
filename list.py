friends = ["Alice", "Apple", True, 10, 3.14, None, "Charlie", "Bob"]

# String is immutable
# In this we can change the list
# but we can't the change the string

print(friends[1])
friends[1] = "Mike"
print(friends[1])

# print list index 0 to 4
print(friends[0:4]) 
# see the output! ['Alice', 'Mike', True, 10] there Apple --> Mike

friends.append("Sakib")
print(friends)
# ['Alice', 'Mike', True, 10, 3.14, None, 'Charlie', 'Bob', 'Sakib'] 

friends.remove(True)
print(friends)
# ['Alice', 'Mike', 10, 3.14, None, 'Charlie', 'Bob', 'Sakib']

friends.pop()
print(friends)
# ['Alice', 'Mike', 10, 3.14, None, 'Charlie', 'Bob']
# removes the last element

friends.sort()  # will sort only the string elements and give error if other data types are present
print(friends) 
# ['Alice', 'Bob', 'Charlie', 'Mike', 10, 3.14, None]
# Suppose a = [5,2,3, 1,4,6]
# output: [1, 2, 3, 4, 5, 6]

friends.reverse()
print(friends)
# [None, 3.14, 10, 'Mike', 'Charlie', 'Bob', 'Alice']
# reverses the list

print(friends.index("Bob"))
# 5
print(friends)
# ouuput: [None, 3.14, 10, 'Mike', 'Charlie', 'Bob', 'Alice']
