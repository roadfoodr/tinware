import pandas as pd
import string
import os
from collections import Counter

STEMS = ["tisane", "satire", "retina"]
BASE_WORDS_FILE = 'NWL23.txt'
DEFINITIONS_FILE = 'scrabble_cheatsheet-definitions-full.csv'

def read_word_list(file_name):
    with open(file_name, 'r') as file:
        return set(word.strip().lower() for word in file)

def is_valid_anagram(word, stem, letter):
    return Counter(word) == Counter(stem + letter)

def generate_words(stem, valid_words):
    results = []
    for letter in string.ascii_lowercase:
        valid_anagrams = [word for word in valid_words 
                          if len(word) == 7 and is_valid_anagram(word, stem, letter)]
        
        if not valid_anagrams:
            valid_anagrams = ['-']
        
        for word in valid_anagrams:
            results.append((word, stem, letter))
    
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
    definitions = load_definitions(DEFINITIONS_FILE)

    for stem in STEMS:
        WORDLIST_PREFIX = f'{stem.upper()}_'
        SCENARIO_PREFIX = f'S_{stem.upper()}_'
        TASK_PREFIX = f'T_{stem.upper()}_'
        OUTPUT_FILE = f'{stem.upper()}_bingo_formatted_list.csv'

        words = generate_words(stem, valid_words)

        df = pd.DataFrame(words, columns=['answerWord', 'root', 'answer'])

        # Check if adding 's' creates a valid 8-letter word
        df['canAddS'] = df.apply(lambda row: 'true' if row['answerWord'] != '-' and row['answerWord'] + 's' in valid_words else 'false', axis=1)

        df['topic'] = f'{stem.upper()} Bingo Stems'
        df['gametype'] = 'BingoStem'
        df['subtopic'] = df['answer']  # Set subtopic to the letter being added
        df['hint'] = ''

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

        # Add taskID
        df['taskID'] = TASK_PREFIX + df.index.astype(str)

        # Reorder columns
        df = df[['taskID', 'scenarioID', 'topic', 'gametype', 'subtopic', 'root', 'answer', 'answerWord', 'hint', 'definition', 'canAddS']]

        # Sort the DataFrame
        df = df.sort_values(['root', 'answer', 'answerWord'])

        # Save to CSV
        df.to_csv(OUTPUT_FILE, index=False)
        print(f"Output saved to: {os.path.join(os.getcwd(), OUTPUT_FILE)}")

        # Print statistics
        total_words = len(df)
        words_with_s = df['canAddS'].value_counts().get('true', 0)
        placeholder_words = df[df['answerWord'] == '-'].shape[0]
        words_with_definitions = df[(df['definition'] != '(definition not found)') & (df['answerWord'] != '-')].shape[0]
        words_without_definitions = df[df['definition'] == '(definition not found)'].shape[0]
        unique_scenarios = df['scenarioID'].nunique()

        print(f"\nStatistics for {stem.upper()}:")
        print(f"Total number of entries: {total_words}")
        print(f"Total number of valid 8-letter words that can be formed by adding 's': {words_with_s}")
        print(f"Number of placeholder entries: {placeholder_words}")
        print(f"Number of words with definitions: {words_with_definitions}")
        print(f"Number of words without definitions: {words_without_definitions}")
        print(f"Number of unique scenarios: {unique_scenarios}")

        # Display example for the first valid word
        print(f"\nExample row for {stem.upper()}:")
        example_row = df[df['answerWord'] != '-'].iloc[0] if not df[df['answerWord'] != '-'].empty else df.iloc[0]
        print(example_row.to_string())

        print("\n" + "="*50 + "\n")

if __name__ == "__main__":
    main()