# 2-Letter Words CSV Generator Prompt

Create a Python and Pandas script that does the following:

1. Set the working directory to the directory containing the script.

2. Read a file named "NWL23.txt" containing a list of valid words, one per line.

3. Generate all possible 2-letter words by:
   a) Adding each letter of the alphabet [a-z] before each letter of the alphabet [a-z]
   b) Adding each letter of the alphabet [a-z] after each letter of the alphabet [a-z]

4. Filter these generated 2-letter words to keep only those that exist in the word list from NWL23.txt.

5. For each valid 2-letter word, check if adding 's' at the end creates a valid 3-letter word (present in the original word list).

6. Read a file named "scrabble_cheatsheet-definitions-full.csv" containing word definitions. Ensure that "nan" is treated as a literal string, not as a NaN value.

7. Create a pandas DataFrame with the following columns:
   - taskID: A unique identifier for each row, formatted as "T_2LW_" followed by a number
   - scenarioID: A unique identifier for each scenario, formatted as "S_2LW_" followed by a number
   - topic: Always "2-Letter Words"
   - gametype: Always "AddOne"
   - subtopic: "before" if the letter was added before, "after" if added after
   - root: The original single letter
   - answer: The letter that was added (or '-' for special cases)
   - answerWord: The resulting 2-letter word (or '-' for special cases)
   - hint: An empty string
   - definition: 
     * For words found in the definitions file: use the provided definition
     * For words not found in the definitions file or with empty definitions: use "(definition not found)"
     * For special case entries (answerWord is '-'): leave blank
   - canAddS: "true" if adding 's' creates a valid 3-letter word, "false" otherwise

8. Add special cases for the letters 'c' and 'v':
   a) Add four rows: two for 'c' (before and after) and two for 'v' (before and after)
   b) For these special cases, set the 'answerWord' and 'answer' fields to '-'
   c) Set 'canAddS' to 'false' for these special cases
   d) Leave the 'definition' blank for these special cases

9. Group the DataFrame by 'topic', 'gametype', 'subtopic', and 'root' to create scenarioIDs.

10. Sort the DataFrame by scenarioID (ascending), answerWord (ascending), and taskID (ascending).

11. Save this DataFrame to a CSV file named "2LW_formatted_list.csv" without including the index.

12. Print some statistics:
    - Total number of entries (including special cases)
    - Total number of valid 3-letter words that can be formed by adding 's'
    - Number of entries with letter added before
    - Number of entries with letter added after
    - Number of placeholder entries (including special cases)
    - Number of words with definitions
    - Number of words without definitions
    - Number of unique scenarios

13. As an example, display all rows for a specific root letter (e.g., "a").

14. Display the rows for all placeholder entries, including the special cases for 'c' and 'v'.

Use pandas for data manipulation and try to optimize for efficiency where possible. Ensure the script is well-commented and follows Python best practices.