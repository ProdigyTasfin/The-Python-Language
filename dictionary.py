# person = {
#     "Name": "Tasfin Hasan Sakib",
#     "Age": 22,
#     "Weight": 67.9,
#     "isAdult": True,
#     "Hooby": ["Gameing", "Coding", "Playing"],
#     "Family": ("Father", "Mother", "Siblings")
# }

# print(person)
# print(person["Name"])


# #Dictionary is mutable, followed non-order, can't repeat the key

# # let 

# person["Name"] = "Nourin Shahanaj Suchana"
# person["Surname"] = "Suchi"
# print("\n", person)
# print("\n New Name: ", person["Name"])
# print("\n Surname: ", person["Surname"]) 

# Nested Dictionaries 

# let suppose, 

student = {
    "Name" : "Animika Oishi",
    "Department": "Agri-Economics",
    "ID" : "23-234-1-20",
    "Major Subjects with Marks":{
        "Micro-Economics" : 56,
        "Agricultural-Econimcs" : 78,
        "Macro-Economics": 55,
    },
    "Minor Subjects with Marks": {
        "English Literature": 80,
        "Agricultural Chemistry": 89,
        "Biodiversity": 70,
    },
}

print(student)
print(student["Name"])
print(student["Major Subjects with Marks"])

print("Marks in Micro-Economics:",student["Major Subjects with Marks"]["Micro-Economics"])
print("Marks in Biodiversity:",student["Minor Subjects with Marks"]["Biodiversity"])
