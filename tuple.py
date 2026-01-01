a = (1, 2, 3)
print(a)
# output: (1, 2, 3)
print(type(a))
# output: <class 'tuple'>
# tuple is immutable
# we can't change the tuple once created
# a[0] = 10
# TypeError: 'tuple' object does not support item assignment
print(a[0])
# output: 1
print(a[0:2])
# output: (1, 2)
# we can not add or remove elements from tuple
# a.append(4)
# AttributeError: 'tuple' object has no attribute 'append'
# a.remove(2)
# AttributeError: 'tuple' object has no attribute 'remove'
b = (4, 5, 6)
c = a + b
print(c)
# output: (1, 2, 3, 4, 5, 6)
print(len(c)) 
# output: 6
# length of the tuple