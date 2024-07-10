# Updated Tinware App Development Prompt

You are tasked with creating a React application called Tinware. The app reads a CSV datafile from an S3 bucket and stores it in IndexedDB using Dexie. Please generate code for the following files, adhering to these specifications:

1. File structure:
   ```
   /src
   ├── components
   │   ├── NavBar.tsx
   │   ├── Settings.tsx
   │   ├── SelectGame.tsx
   │   └── PlayGame.tsx
   ├── services
   │   └── DataInitializer.tsx
   ├── App.tsx
   ├── main.tsx
   └── db.ts
   ```

2. General requirements:
   - Use React for building the user interface.
   - Use Vite as the build tool.
   - Use TypeScript for all files.
   - For all code generations, include a comment at the top of the file with the current date and time, with the value converted to US Eastern timezone.
   - Use the PureCSS library for all UI elements and styling.
   - Use the FontAwesome package for any icons needed.
   - The app should be responsive and mobile-friendly.

3. db.ts:
   - Use Dexie to define the database schema and create a database instance.
   - Define an interface for the WordItem with the following fields:
     ```typescript
     interface WordItem {
       id?: number;
       taskID: string;
       topic: string;
       gametype: string;
       subtopic: string;
       root: string;
       answer: string;
       answerWord: string;
       hint: string;
       definition: string;
       canAddS: number;
     }
     ```
   - Export the database instance for use in other components.

4. DataInitializer.tsx:
   - Use Dexie for all database operations.
   - Fetch CSV data from an S3 bucket using the URL stored in the environment variable VITE_REACT_APP_CSV_URL.
   - Parse the CSV data using the Papa Parse library.
   - Store the parsed data in IndexedDB using Dexie.
   - Implement a clearCache function to remove data from IndexedDB.
   - Export the DataInitializer component, getFromIndexedDB, and clearCache functions.

5. NavBar.tsx:
   - Create a navbar component that sticks to the top of the browser window.
   - Include the title "TINWARE" in a bold, fixed-width, serif (typewriter-style) font.
   - Include a dropdown "Settings" menu at the top right of the navbar.
   - In the Settings menu, include the "Clear Cache" function that is exported by the DataInitializer component.

6. SelectGame.tsx:
   - Use Dexie to fetch unique topics from the stored data.
   - Implement a dropdown menu to select topics, adding an option for "All Words".
   - Once a topic is selected by the user, the SelectGame component will disappear and be replaced by PlayGame.

7. PlayGame.tsx:
   - Implement the main gameplay logic for different game types, starting with "AddOne".
   - For the "AddOne" game type:
     - Display the prompt "Which letters go [before|after] the following word stem?" with [before|after] in bold.
     - Show the root word in uppercase and fixed-width font.
     - Provide an input area for a single letter, positioned before or after the root based on the current subtopic.
     - Validate user input against the set of unique values in the "answer" column of the current answerSet.
     - Ignore input that is not an alphabetic character (upper or lower case).
     - Treat space input as clicking "No More Words".
     - Display valid and invalid entries in a display area below the input.
     - Use color-coding for answers: green for valid, dark gray with strikethrough for invalid, red for missed valid answers.
     - Implement "No More Words" and "Skip Word" buttons.
     - After clicking "No More Words", hide the input area and change the "Skip Word" button to "Next Word".
     - When the "Next Word" button is active, pressing the space key should have the same effect as clicking "Next Word".
     - Ensure no repeated rows in the display area.
   - Use a useRef hook to automatically focus the input field when a new word is selected.
   - Implement case-insensitive validation for user input.
   - Display all words (root and answerWords) in uppercase and fixed-width font.
   - Update success messages:
     - When all words are correctly identified: "You correctly identified all {total count of correct options} words!"
     - When some words are identified but not all: "You identified {count of words identified} out of {total count of correct options} words"
     - For words with no valid answers: "There are no letters that can go {before|after} {ROOT}." (with ROOT in uppercase and fixed-width font)
   - Error message for invalid words: "Not a valid word in this lexicon".
   - Implement a transition period when moving to the next word to prevent unintended actions:
     - Add an isTransitioning state variable.
     - Update the handleKeyPress effect to check for isTransitioning before triggering the next word action.
     - Create a handleNextWord function that sets isTransitioning to true, calls selectNewWord and onSkipWord, and uses setTimeout to set isTransitioning back to false after a short delay.
     - Disable the "Next Word" button during transitions.
   - Update the success message styling:
     - Use a light orange background for partial success ("You identified {count} out of {count} words").
     - Keep the light green background for complete success.

8. App.tsx:
   - Compose the main application using NavBar, DataInitializer, SelectGame, and PlayGame components.
   - Manage the dataLoaded state to control when SelectGame and PlayGame are rendered.
   - Implement handleSelectTopic function to fetch and filter data based on the selected topic.
   - Handle cases where no data is available for a selected topic.
   - Implement a handleRestart function to reset the game state.
   - Implement a handleClearCache function to clear the database and reset the app state.
   - Pass the selectedTopic prop to the PlayGame component.

9. main.tsx:
   - Set up the React application entry point.
   - Import and use PureCSS styles.
   - Import and use FontAwesome.

10. Styling:
    - Update index.css to support the PlayGame requirements:
      - Use a bold, fixed-width, serif (typewriter-style) font for root and answerWord displays.
      - Implement color-coding for different answer types:
        - Valid answers: light green background, dark green text
        - Invalid answers: light gray background, dark gray text, strikethrough
        - Missed answers: light red background, dark red text
      - Style the success-message classes:
        - all-words: light green background, dark green text
        - some-words: light orange background, dark orange text
      - Style the error-message class with a light red background and dark red text.
      - Improve the styling of the input area, making the input field more prominent and centered.
      - Enhance the appearance of the answer rows by adding padding, border-radius, and a subtle background color.
      - Adjust the font sizes and colors for better readability.
      - Add spacing between buttons and other elements for a cleaner look.
      - Style the definition text to be italic and gray, distinguishing it from the answer word.

Please generate the code for these files, ensuring that they work together to create a functional Tinware app. The app should load CSV data, store it in IndexedDB using Dexie, allow users to filter data by topic, implement the gameplay logic for the "AddOne" game type, and provide a way to clear the cached data.