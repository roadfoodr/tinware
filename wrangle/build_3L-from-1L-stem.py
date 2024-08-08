import pandas as pd
import string
import os

STEMS = ["j", "z", "q", "k", "v", "c"]
BASE_WORDS_FILE = 'NWL23.txt'
DEFINITIONS_FILE = 'scrabble_cheatsheet-definitions-full.csv'

def read_word_list(file_name):
    with open(file_name, 'r') as file:
        return set(word.strip().lower() for word in file)

def generate_three_letter_words(stem, valid_words):
    results = []
    for letter in string.ascii_lowercase:
        after_words_1 = []
        after_words_2 = []
        before_words_1 = []
        before_words_2 = []
        for blank in string.ascii_lowercase:
            after_word_1 = f"{stem}{letter}{blank}"
            after_word_2 = f"{letter}{stem}{blank}"
            before_word_1 = f"{blank}{stem}{letter}"
            before_word_2 = f"{blank}{letter}{stem}"
            
            if after_word_1 in valid_words:
                after_words_1.append((after_word_1, f"{stem}+{letter}+", blank, 'after'))
            if after_word_2 in valid_words:
                after_words_2.append((after_word_2, f"{letter}+{stem}+", blank, 'after'))
            if before_word_1 in valid_words:
                before_words_1.append((before_word_1, f"+{stem}+{letter}", blank, 'before'))
            if before_word_2 in valid_words:
                before_words_2.append((before_word_2, f"+{letter}+{stem}", blank, 'before'))
        
        results.extend(after_words_1)
        results.extend(after_words_2)
        results.extend(before_words_1)
        results.extend(before_words_2)
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
        OUTPUT_FILE = f'3L_{stem}_formatted_list.csv'

        three_letter_words = generate_three_letter_words(stem, valid_words)

        df = pd.DataFrame(three_letter_words, columns=['answerWord', 'root', 'answer', 'subtopic'])

        # Remove duplicates based on subtopic, root, answer, and answerWord
        df = df.drop_duplicates(subset=['subtopic', 'root', 'answer', 'answerWord'])

        # Check if adding 's' creates a valid 4-letter word
        df['canAddS'] = df['answerWord'].apply(lambda x: 'true' if x + 's' in valid_words else 'false')

        df['topic'] = f'3-Letter {stem.upper()} Words'
        df['gametype'] = 'AddOne'
        df['hint'] = ''

        # Fill in definitions
        df['definition'] = df['answerWord'].apply(lambda x: definitions.get(x, '(definition not found)'))
        
        # Create scenarioID
        df['scenarioID'] = df.groupby(['root', 'subtopic']).ngroup()
        df['scenarioID'] = f'S-3L-{stem.upper()}_' + df['scenarioID'].astype(str)

        # Add taskID
        df['taskID'] = f'T-3L-{stem.upper()}_' + df.index.astype(str)

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
        words_with_definitions = df[df['definition'] != '(definition not found)'].shape[0]
        words_without_definitions = df[df['definition'] == '(definition not found)'].shape[0]
        unique_scenarios = df['scenarioID'].nunique()

        print(f"\nStatistics for {stem.upper()}:")
        print(f"Total number of entries: {total_words}")
        print(f"Total number of valid 4-letter words that can be formed by adding 's': {words_with_s}")
        print(f"Number of 'before' entries: {words_before}")
        print(f"Number of 'after' entries: {words_after}")
        print(f"Number of words with definitions: {words_with_definitions}")
        print(f"Number of words without definitions: {words_without_definitions}")
        print(f"Number of unique scenarios: {unique_scenarios}")

        # Display example rows
        print(f"\nExample rows for stem '{stem}':")
        print("'Before' entries:")
        print(df[(df['subtopic'] == 'before') & (df['root'].str.startswith('+'))].iloc[0].to_string() if not df[(df['subtopic'] == 'before') & (df['root'].str.startswith('+'))].empty else "No '+{stem}+{letter}' entries")
        print(df[(df['subtopic'] == 'before') & (~df['root'].str.startswith('+'))].iloc[0].to_string() if not df[(df['subtopic'] == 'before') & (~df['root'].str.startswith('+'))].empty else "No '+{letter}+{stem}' entries")
        print("'After' entries:")
        print(df[(df['subtopic'] == 'after') & (df['root'].str.startswith(stem))].iloc[0].to_string() if not df[(df['subtopic'] == 'after') & (df['root'].str.startswith(stem))].empty else "No '{stem}+{letter}+' entries")
        print(df[(df['subtopic'] == 'after') & (~df['root'].str.startswith(stem))].iloc[0].to_string() if not df[(df['subtopic'] == 'after') & (~df['root'].str.startswith(stem))].empty else "No '{letter}+{stem}+' entries")

        print("\n" + "="*50 + "\n")

if __name__ == "__main__":
    main()