letter = '''
Dear <|NAME|>, 
    I hope you are doing well. 
    I am happy to inform you that you have been selected for the position of <|POSITION|> at our company. 
    
    <|DATE|>
'''

print(letter.replace("<|NAME|>", "Tasfin").replace("<|POSITION|>", "Software Engineer").replace("<|DATE|>", "1st Dec 2025"))