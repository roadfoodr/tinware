# Bingo Stems Generator Script Prompt

Create a Python and Pandas script that generates wordlists for Bingo Stem games. The script should do the following:

1. Set the working directory to the directory containing the script.

2. Read a file named "NWL23.txt" containing a list of valid words, one per line.

3. Define a list of stems to process: "tisane", "satire", and "retina".

4. For each stem:
   a) Generate valid 7-letter words by adding each letter of the alphabet [a-z] to the stem
   b) Look in NWL23.txt for valid 7-letter words that are anagrams of the stem + added letter
   c) Ensure that anagrams have exactly the same letter counts as the stem + added letter

5. For a given combination of stem + letter, if there are no valid words, add a placeholder row with "-" as the added letter (answer) and "-" as the answerWord

6. All of the valid (or placeholder) words for each combination of stem + letter will have the same scenarioID, which will be unique from other combinations of stem + letter. The scenarioID prefix should be "S_{STEM}_"

7. Each row will have a unique taskID, with prefix "T_{STEM}_"

8. Read a file named "scrabble_cheatsheet-definitions-full.csv" containing word definitions. Ensure that "nan" is treated as a literal string, not as a NaN value.

9. Create a pandas DataFrame for each stem with the following columns:
   - taskID: A unique identifier for each row, formatted as "T_{STEM}_" followed by a number
   - scenarioID: A unique identifier for each scenario, formatted as "S_{STEM}_" followed by a number
   - topic: "{STEM} Bingo Stems"
   - gametype: Always "BingoStem"
   - subtopic: The letter being added
   - root: The original stem
   - answer: The letter that was added (or '-' for placeholders)
   - answerWord: The resulting 7-letter word (or '-' for placeholders)
   - hint: An empty string
   - definition: 
     * For words found in the definitions file: use the provided definition
     * For words not found in the definitions file or with empty definitions: use "(definition not found)"
     * For placeholder entries (answerWord is '-'): leave blank
   - canAddS: "true" if adding 's' creates a valid 8-letter word, "false" otherwise

10. Sort each DataFrame by root, then answer, then answerWord

11. Save each DataFrame to a CSV file named "{STEM}_bingo_formatted_list.csv" without including the index.

12. For each stem, print some statistics:
    - Total number of entries (including placeholders)
    - Total number of valid 8-letter words that can be formed by adding 's'
    - Number of placeholder entries
    - Number of words with definitions
    - Number of words without definitions
    - Number of unique scenarios

13. For each stem, display an example row (preferably a non-placeholder entry)

Use pandas for data manipulation and try to optimize for efficiency where possible. Ensure the script is well-commented and follows Python best practices.