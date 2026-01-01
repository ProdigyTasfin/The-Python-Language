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
