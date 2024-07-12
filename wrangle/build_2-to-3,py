import pandas as pd
import os
import string

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

def main():
    # Get the directory of the current script
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Change the current working directory to the script directory
    os.chdir(script_dir)

    valid_words = read_word_list('NWL23.txt')
    two_letter_words = [word for word in valid_words if len(word) == 2]

    three_letter_words = generate_three_letter_words(two_letter_words, valid_words)

    df = pd.DataFrame(three_letter_words, columns=['answerWord', 'root', 'answer', 'subtopic'])

    # Check if adding 's' creates a valid 4-letter word
    df['canAddS'] = df.apply(lambda row: 'true' if row['answerWord'] != '-' and row['answerWord'] + 's' in valid_words else 'false', axis=1)

    df['taskID'] = 'task_' + df.index.astype(str)
    df['topic'] = '3-Letter Words'
    df['gametype'] = 'AddOne'
    df['hint'] = ''
    df['definition'] = 'pending'

    # Reorder columns
    df = df[['taskID', 'topic', 'gametype', 'subtopic', 'root', 'answer', 'answerWord', 'hint', 'definition', 'canAddS']]

    # Save to CSV
    df.to_csv('valid_three_letter_words_formatted.csv', index=False)

    # Print statistics
    total_words = len(df)
    words_with_s = df['canAddS'].value_counts().get('true', 0)
    words_before = df[df['subtopic'] == 'before'].shape[0]
    words_after = df[df['subtopic'] == 'after'].shape[0]
    placeholder_words = df[df['answerWord'] == '-'].shape[0]

    print(f"Total number of entries: {total_words}")
    print(f"Total number of valid 4-letter words that can be formed by adding 's': {words_with_s}")
    print(f"Number of entries with letter added before: {words_before}")
    print(f"Number of entries with letter added after: {words_after}")
    print(f"Number of placeholder entries: {placeholder_words}")

    # Display example for root word 'be'
    print("\nExample rows for root word 'be':")
    print(df[df['root'] == 'be'].to_string(index=False))

    # Display rows with placeholders
    print("\nRows with placeholders:")
    print(df[df['answerWord'] == '-'].to_string(index=False))

if __name__ == "__main__":
    main()