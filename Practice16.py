# Q: Program to ask the user to enter names of their 3 favorite movies and store them in a list

# Difficulty: Medium 

# movie1 = input("Enter Your First Movie: ")
# movie2 = input("Enter Your Second Movie: ")
# movie3 = input("Enter Your Third Movie: ")

# list = []
# list.append(movie1)
# list.append(movie2)
# list.append(movie3)

# print(list) 

movies = []

for i in range(3):
    movie = input("Enter a movie: ")
    movies.append(movie)

print(movies)