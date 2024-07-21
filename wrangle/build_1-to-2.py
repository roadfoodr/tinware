import pandas as pd
import string
import os

WORDLIST_PREFIX = '2LW_'
SCENARIO_PREFIX = 'S_' + WORDLIST_PREFIX
TASK_PREFIX = 'T_' + WORDLIST_PREFIX

BASE_WORDS_FILE = 'NWL23.txt'
DEFINITIONS_FILE = 'scrabble_cheatsheet-definitions-full.csv'
OUTPUT_FILE = WORDLIST_PREFIX + 'formatted_list.csv'


def read_word_list(file_name):
    with open(file_name, 'r') as file:
        return set(word.strip().lower() for word in file)

def generate_two_letter_words():
    before = [(letter + root, root, letter, 'before') for root in string.ascii_lowercase for letter in string.ascii_lowercase]
    after = [(root + letter, root, letter, 'after') for root in string.ascii_lowercase for letter in string.ascii_lowercase]
    return before + after

def load_definitions(file_name):
    df_definitions = pd.read_csv(file_name, keep_default_na=False)
    return dict(zip(df_definitions['word'], df_definitions['definition']))

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
            'definition': ['']
        })
        df = pd.concat([df, new_row], ignore_index=True)
    return df

def main():
    # Set working directory to script location
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    print(f"Current working directory: {os.getcwd()}")

    # Read the word list
    valid_words = read_word_list(BASE_WORDS_FILE)

    # Generate and filter 2-letter words
    two_letter_words = generate_two_letter_words()
    valid_two_letter_words = [word for word in two_letter_words if word[0] in valid_words]

    # Create DataFrame
    df = pd.DataFrame(valid_two_letter_words, columns=['answerWord', 'root', 'answer', 'subtopic'])

    # Check if adding 's' creates a valid 3-letter word
    df['canAddS'] = df['answerWord'].apply(lambda x: 'true' if x + 's' in valid_words else 'false')

    # Add additional columns
    df['topic'] = '2-Letter Words'
    df['gametype'] = 'AddOne'
    df['hint'] = ''

    # Load definitions
    definitions = load_definitions(DEFINITIONS_FILE)

    # Fill in definitions
    df['definition'] = df.apply(lambda row: 
        '' if row['answerWord'] == '-' else
        definitions.get(row['answerWord'], '(definition not found)'),
        axis=1
    )
    
    # Handle empty definitions, but keep blank for "-" answerWords
    df.loc[(df['definition'] == '') & (df['answerWord'] != '-'), 'definition'] = '(definition not found)'

    # Add special cases for 'c' and 'v'
    df = add_special_cases(df)

    # Create scenarioID
    df['scenarioID'] = df.groupby(['topic', 'gametype', 'subtopic', 'root']).ngroup()
    df['scenarioID'] = SCENARIO_PREFIX + df['scenarioID'].astype(str)

    # Add taskID after adding special cases to ensure continuous numbering
    df['taskID'] = TASK_PREFIX + df.index.astype(str)

    # Reorder columns
    df = df[['taskID', 'scenarioID', 'topic', 'gametype', 'subtopic', 'root', 'answer', 'answerWord', 'hint', 'definition', 'canAddS']]

    # Sort the DataFrame
    df = df.sort_values(['scenarioID', 'answerWord', 'taskID'])

    # Save to CSV
    df.to_csv(OUTPUT_FILE, index=False)
    print(f"Output saved to: {os.path.join(os.getcwd(), OUTPUT_FILE)}")

    # Print statistics
    total_words = len(df)
    words_with_s = df['canAddS'].value_counts().get('true', 0)
    words_before = df[df['subtopic'] == 'before'].shape[0]
    words_after = df[df['subtopic'] == 'after'].shape[0]
    placeholder_words = df[df['answerWord'] == '-'].shape[0]
    words_with_definitions = df[(df['definition'] != '(definition not found)') & (df['answerWord'] != '-')].shape[0]
    words_without_definitions = df[df['definition'] == '(definition not found)'].shape[0]
    unique_scenarios = df['scenarioID'].nunique()

    print(f"\nTotal number of entries: {total_words}")
    print(f"Total number of valid 3-letter words that can be formed by adding 's': {words_with_s}")
    print(f"Number of entries with letter added before: {words_before}")
    print(f"Number of entries with letter added after: {words_after}")
    print(f"Number of placeholder entries: {placeholder_words}")
    print(f"Number of words with definitions: {words_with_definitions}")
    print(f"Number of words without definitions: {words_without_definitions}")
    print(f"Number of unique scenarios: {unique_scenarios}")

    # Display example for root letter 'a'
    print("\nExample rows for root letter 'a':")
    print(df[df['root'] == 'a'].to_string(index=False))

    # Display rows with placeholders, including special cases
    print("\nRows with placeholders (including special cases for 'c' and 'v'):")
    print(df[df['answerWord'] == '-'].to_string(index=False))

if __name__ == "__main__":
    main()