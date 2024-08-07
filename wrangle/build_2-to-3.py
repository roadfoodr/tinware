import pandas as pd
import string
import os

WORDLIST_PREFIX = '2-3LW_'
SCENARIO_PREFIX = 'S_' + WORDLIST_PREFIX
TASK_PREFIX = 'T_' + WORDLIST_PREFIX

BASE_WORDS_FILE = 'NWL23.txt'
DEFINITIONS_FILE = 'scrabble_cheatsheet-definitions-full.csv'
OUTPUT_FILE = WORDLIST_PREFIX + 'formatted_list.csv'


def read_word_list(file_name):
    with open(file_name, 'r') as file:
        return set(word.strip().lower() for word in file)

def generate_three_letter_words(two_letter_words, valid_words):
    results = []
    for word in two_letter_words:
        before = [(letter + word, word, letter, 'before') for letter in string.ascii_lowercase if letter + word in valid_words]
        after = [(word + letter, word, letter, 'after') for letter in string.ascii_lowercase if word + letter in valid_words]
        
        # Add placeholder if no valid words found
        if not before:
            before = [('-', word, '-', 'before')]
        if not after:
            after = [('-', word, '-', 'after')]
        
        results.extend(before + after)
    return results

def load_definitions(file_name):
    df_definitions = pd.read_csv(file_name, keep_default_na=False)
    return dict(zip(df_definitions['word'], df_definitions['definition']))

def main():
    # Set working directory to script location
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    print(f"Current working directory: {os.getcwd()}")

    valid_words = read_word_list(BASE_WORDS_FILE)
    two_letter_words = [word for word in valid_words if len(word) == 2]

    three_letter_words = generate_three_letter_words(two_letter_words, valid_words)

    df = pd.DataFrame(three_letter_words, columns=['answerWord', 'root', 'answer', 'subtopic'])

    # Check if adding 's' creates a valid 4-letter word
    df['canAddS'] = df.apply(lambda row: 'true' if row['answerWord'] != '-' and row['answerWord'] + 's' in valid_words else 'false', axis=1)

    df['topic'] = '2-to-make-3-Letter Words'
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

    # Create scenarioID
    df['scenarioID'] = df.groupby(['topic', 'gametype', 'subtopic', 'root']).ngroup()
    df['scenarioID'] = SCENARIO_PREFIX + df['scenarioID'].astype(str)

    # Add taskID with new prefix
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
    print(f"Total number of valid 4-letter words that can be formed by adding 's': {words_with_s}")
    print(f"Number of entries with letter added before: {words_before}")
    print(f"Number of entries with letter added after: {words_after}")
    print(f"Number of placeholder entries: {placeholder_words}")
    print(f"Number of words with definitions: {words_with_definitions}")
    print(f"Number of words without definitions: {words_without_definitions}")
    print(f"Number of unique scenarios: {unique_scenarios}")

    # Display example for root word 'be'
    print("\nExample rows for root word 'be':")
    print(df[df['root'] == 'be'].to_string(index=False))

    # Display rows with placeholders
    print("\nRows with placeholders:")
    print(df[df['answerWord'] == '-'].to_string(index=False))

if __name__ == "__main__":
    main()