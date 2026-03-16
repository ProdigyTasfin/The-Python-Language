# --------------------------------------------
# SET BASICS
# --------------------------------------------

# A set stores unique elements
# Duplicate values are automatically removed
# Sets are mutable but unordered

numbers = {1, 2, 3, 4, 4, 5}

print("Original Set:")
print(numbers)   # duplicates removed automatically


# --------------------------------------------
# CREATING AN EMPTY SET
# --------------------------------------------

# Important: {} creates a dictionary, not a set
# To create an empty set we must use set()

empty_set = set()

print("\nEmpty Set:")
print(empty_set)


# --------------------------------------------
# ADDING ELEMENTS
# --------------------------------------------

numbers.add(6)

print("\nAfter Adding 6:")
print(numbers)


# --------------------------------------------
# ADDING MULTIPLE ELEMENTS
# --------------------------------------------

numbers.update([7, 8, 9])

print("\nAfter Adding Multiple Elements:")
print(numbers)


# --------------------------------------------
# REMOVING ELEMENTS
# --------------------------------------------

numbers.remove(3)   # removes element (error if not found)

print("\nAfter Removing 3:")
print(numbers)


# discard() removes element without error

numbers.discard(9)

print("\nUsing discard (no error if element missing):")
print(numbers)


# pop() removes a random element

numbers.pop()

print("\nAfter pop() (random element removed):")
print(numbers)


# --------------------------------------------
# SET OPERATIONS
# --------------------------------------------

A = {1, 2, 3, 4}
B = {3, 4, 5, 6}

print("\nSet A:", A)
print("Set B:", B)

# Union (combine both sets)

print("\nUnion:")
print(A | B)

# Intersection (common elements)

print("\nIntersection:")
print(A & B)

# Difference

print("\nDifference A - B:")
print(A - B)

# Symmetric Difference

print("\nSymmetric Difference:")
print(A ^ B)


# --------------------------------------------
# CHECKING MEMBERSHIP
# --------------------------------------------

print("\nCheck if 2 is in set A:")
print(2 in A)


# --------------------------------------------
# CLEARING A SET
# --------------------------------------------

A.clear()

print("\nAfter clear():")
print(A)