import pandas as pd
import os
import string

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Change the current working directory to the script directory
os.chdir(script_dir)

def read_word_list(file_name):
    with open(file_name, 'r') as file:
        return set(word.strip().lower() for word in file)

def generate_two_letter_words():
    before = [(letter + root, root, letter, 'before') for root in string.ascii_lowercase for letter in string.ascii_lowercase]
    after = [(root + letter, root, letter, 'after') for root in string.ascii_lowercase for letter in string.ascii_lowercase]
    return before + after

def add_special_cases(df):
    special_cases = [
        ('c', 'before'), ('c', 'after'),
        ('v', 'before'), ('v', 'after')
    ]
    for root, subtopic in special_cases:
        new_row = pd.DataFrame({
            'answerWord': ['-'],
            'root': [root],
            'answer': ['-'],
            'subtopic': [subtopic],
            'canAddS': ['false'],
            'topic': ['2-Letter Words'],
            'gametype': ['AddOne'],
            'hint': [''],
            'definition': ['pending']
        })
        df = pd.concat([df, new_row], ignore_index=True)
    return df

valid_words = read_word_list('NWL23.txt')

two_letter_words = generate_two_letter_words()
valid_two_letter_words = [word for word in two_letter_words if word[0] in valid_words]

df = pd.DataFrame(valid_two_letter_words, columns=['answerWord', 'root', 'answer', 'subtopic'])

df['canAddS'] = df['answerWord'].apply(lambda x: 'true' if x + 's' in valid_words else 'false')

df['topic'] = '2-Letter Words'
df['gametype'] = 'AddOne'
df['hint'] = ''
df['definition'] = 'pending'

# Add special cases for 'c' and 'v'
df = add_special_cases(df)

# Add taskID after adding special cases to ensure continuous numbering
df['taskID'] = 'task_' + df.index.astype(str)

df = df[['taskID', 'topic', 'gametype', 'subtopic', 'root', 'answer', 'answerWord', 'hint', 'definition', 'canAddS']]

df.to_csv('valid_two_letter_words_formatted.csv', index=False)

total_words = len(df)
words_with_s = df['canAddS'].value_counts()['true']
words_before = df[df['subtopic'] == 'before'].shape[0]
words_after = df[df['subtopic'] == 'after'].shape[0]

print(f"Total number of valid 2-letter words generated: {total_words}")
print(f"Total number of valid 3-letter words that can be formed by adding 's': {words_with_s}")
print(f"Number of valid 2-letter words formed by adding a letter before: {words_before}")
print(f"Number of valid 2-letter words formed by adding a letter after: {words_after}")

print("\nExample rows for root letter 'a':")
print(df[df['root'] == 'a'].to_string(index=False))

print("\nRows for special cases 'c' and 'v':")
print(df[df['root'].isin(['c', 'v'])].to_string(index=False))