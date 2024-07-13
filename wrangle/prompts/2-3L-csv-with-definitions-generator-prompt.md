Create a Python and Pandas script that does the following:

1. Set the working directory to the directory containing the script.

2. Read a file named "NWL23.txt" containing a list of valid words, one per line.

3. Extract all 2-letter words from this list.

4. For each 2-letter word, generate 3-letter words by:
   a) Adding each letter of the alphabet [a-z] before the 2-letter word
   b) Adding each letter of the alphabet [a-z] after the 2-letter word

5. Filter the generated 3-letter words to keep only those that exist in the original word list.

6. Ensure that each 2-letter word has at least one "before" and one "after" entry:
   a) If no valid 3-letter words are formed by adding a letter before, include a placeholder row with "-" as the added letter (answer) and "-" as the answerWord
   b) If no valid 3-letter words are formed by adding a letter after, include a placeholder row with "-" as the added letter (answer) and "-" as the answerWord

7. For each valid 3-letter word (and placeholder entries), check if adding 's' at the end creates a valid 4-letter word (present in the original word list).

8. Read a file named "scrabble_word_definitions.csv" containing word definitions. Ensure that "nan" is treated as a literal string, not as a NaN value.

9. Create a pandas DataFrame with the following columns:
   - taskID: A unique identifier for each row, formatted as "2-3LW_" followed by a number
   - topic: Always "2-to-make-3-Letter Words"
   - gametype: Always "AddOne"
   - subtopic: "before" if the letter was added before, "after" if added after
   - root: The original 2-letter word
   - answer: The letter that was added (or '-' for placeholder entries)
   - answerWord: The resulting 3-letter word (or '-' for placeholder entries)
   - hint: An empty string
   - definition: 
     * For placeholder entries (answerWord is '-'): leave blank
     * For words found in the definitions file: use the provided definition
     * For words not found in the definitions file or with empty definitions: use "(definition not found)"
   - canAddS: "true" if adding 's' creates a valid 4-letter word, "false" otherwise

10. Save this DataFrame to a CSV file named "valid_three_letter_words_formatted.csv" without including the index.

11. Print some statistics:
    - Total number of entries (including placeholders)
    - Total number of valid 4-letter words that can be formed by adding 's'
    - Number of entries with letter added before
    - Number of entries with letter added after
    - Number of placeholder entries
    - Number of words with definitions (excluding placeholders)
    - Number of words without definitions

12. As an example, display all rows for a specific 2-letter word (e.g., "be").

13. Display all rows with placeholders (where answerWord is "-").

Use pandas for data manipulation and try to optimize for efficiency where possible. Ensure the script is well-commented and follows Python best practices.