# 3-Letter Stem Word Generator Prompt

Create a Python and Pandas script that generates wordlists for 3-letter words containing specific stems. The script should do the following:

1. Set the working directory to the directory containing the script.

2. Read a file named "NWL23.txt" containing a list of valid words, one per line.

3. Define a list of stems to process: "j", "z", "q", "k", "v", and "c".

4. For each stem, generate valid 3-letter words using the following patterns:
   a) {STEM}{LETTER}{BLANK} (marked as "after")
   b) {LETTER}{STEM}{BLANK} (marked as "after")
   c) {BLANK}{STEM}{LETTER} (marked as "before")
   d) {BLANK}{LETTER}{STEM} (marked as "before")
   Where {LETTER} and {BLANK} are each letter of the alphabet [a-z].

5. Look in NWL23.txt to verify that generated words are valid.

6. Read a file named "scrabble_cheatsheet-definitions-full.csv" containing word definitions. Ensure that "nan" is treated as a literal string, not as a NaN value.

7. Create a pandas DataFrame for each stem with the following columns:
   - taskID: A unique identifier for each row, formatted as "T-3L-{STEM}_" followed by a number
   - scenarioID: A unique identifier for each scenario, formatted as "S-3L-{STEM}_" followed by a number
   - topic: "3-Letter {STEM} Words"
   - gametype: Always "AddOne"
   - subtopic: "before" or "after" based on the word pattern
   - root: 
     * For "after" words: "{stem}+{letter}+" or "{letter}+{stem}+"
     * For "before" words: "+{stem}+{letter}" or "+{letter}+{stem}"
   - answer: The letter that was added ({BLANK})
   - answerWord: The resulting 3-letter word
   - hint: An empty string
   - definition: 
     * For words found in the definitions file: use the provided definition
     * For words not found in the definitions file: use "(definition not found)"
   - canAddS: "true" if adding 's' creates a valid 4-letter word, "false" otherwise

8. Group the DataFrame by 'root' and 'subtopic' to create scenarioIDs.

9. Sort each DataFrame by scenarioID (ascending), answerWord (ascending), and taskID (ascending).

10. Save each DataFrame to a CSV file named "3L_{STEM}_formatted_list.csv" without including the index.

11. For each stem, print some statistics:
    - Total number of entries
    - Total number of valid 4-letter words that can be formed by adding 's'
    - Number of 'before' entries
    - Number of 'after' entries
    - Number of words with definitions
    - Number of words without definitions
    - Number of unique scenarios

12. For each stem, display example rows for each of the four patterns (if they exist).

Use pandas for data manipulation and try to optimize for efficiency where possible. Ensure the script is well-commented and follows Python best practices.


## Key Logic Points

1. Word Generation: The script generates candidate words by combining the stem with two other letters in four different patterns. This ensures all possible 3-letter words containing the stem are considered.

2. Validation: Only words that appear in the NWL23.txt file are included in the final list, ensuring all words are valid.

3. Categorization: Words are categorized as "before" or "after" based on where the blank space is filled relative to the stem. This allows for different types of word formation exercises.

4. Scenario Creation: Each unique combination of root pattern and before/after category forms a scenario. This allows for grouped exercises focusing on specific word formation patterns.

5. Definition Lookup: The script attempts to provide a definition for each word, enhancing the educational value of the wordlist.

6. Extendability: The 's' check allows for potential extension of exercises to 4-letter words.

By following this prompt, you should be able to create a script that generates comprehensive, well-structured wordlists for various stem-based word exercises and analyses.