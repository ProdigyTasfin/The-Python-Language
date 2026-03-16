# --------------------------------------------
# DICTIONARY BASICS
# --------------------------------------------

# A dictionary stores data in key:value pairs
# It is mutable (can be modified)
# Keys must be unique

person = {
    "Name": "Tasfin Hasan Sakib",
    "Age": 22,
    "Weight": 67.9,
    "isAdult": True,
    "Hobby": ["Gaming", "Coding", "Playing"],   # List inside dictionary
    "Family": ("Father", "Mother", "Siblings")  # Tuple inside dictionary
}

print("Full Dictionary:")
print(person)

print("\nAccessing a specific value:")
print(person["Name"])


# --------------------------------------------
# MODIFYING DICTIONARY DATA
# --------------------------------------------

# Changing an existing value
person["Name"] = "Nourin Shahanaj Suchana"

# Adding a new key-value pair
person["Surname"] = "Suchi"

print("\nUpdated Dictionary:")
print(person)

print("\nNew Name:", person["Name"])
print("Surname:", person["Surname"])


# --------------------------------------------
# NESTED DICTIONARIES
# --------------------------------------------

# Dictionary inside another dictionary

student = {
    "Name": "Animika Oishi",
    "Department": "Agri-Economics",
    "ID": "23-234-1-20",

    "Major Subjects with Marks": {
        "Micro-Economics": 56,
        "Agricultural-Economics": 78,
        "Macro-Economics": 55
    },

    "Minor Subjects with Marks": {
        "English Literature": 80,
        "Agricultural Chemistry": 89,
        "Biodiversity": 70
    }
}

print("\nStudent Dictionary:")
print(student)

print("\nStudent Name:", student["Name"])

print("\nMarks in Micro-Economics:",
      student["Major Subjects with Marks"]["Micro-Economics"])

print("Marks in Biodiversity:",
      student["Minor Subjects with Marks"]["Biodiversity"])


# --------------------------------------------
# DICTIONARY METHODS
# --------------------------------------------

# keys() → returns all keys
print("\nAll Keys:")
print(student.keys())

# values() → returns all values
print("\nAll Values:")
print(student.values())

# items() → returns (key, value) pairs
print("\nAll Key-Value Pairs:")
print(student.items())


# --------------------------------------------
# USING get()
# --------------------------------------------

# get() safely retrieves a value

print("\nUsing get() method:")

print("Access name2 (not present):",
      student.get("name2"))   # returns None instead of error

print("Access Name:",
      student.get("Name"))


# --------------------------------------------
# update()
# --------------------------------------------

# Adds a new key-value pair
student.update({"CGPA": 3.85})

print("\nAfter Adding CGPA:")
print(student)


# --------------------------------------------
# pop()
# --------------------------------------------

# Removes a specific key
student.pop("ID")

print("\nAfter Removing ID:")
print(student)


# --------------------------------------------
# MODIFYING NESTED DICTIONARY VALUE
# --------------------------------------------

student["Major Subjects with Marks"]["Micro-Economics"] = 60

print("\nAfter Updating Micro-Economics Marks:")
print(student)


# --------------------------------------------
# fromkeys()
# --------------------------------------------

# Creates a new dictionary with given keys
keys = ["Name", "Department", "CGPA"]

new_dict = dict.fromkeys(keys, "Not Assigned")

print("\nDictionary created using fromkeys():")
print(new_dict)


# --------------------------------------------
# clear()
# --------------------------------------------

# Removes all items from dictionary
student.clear()

print("\nAfter clear():")
print(student)