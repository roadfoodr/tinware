# Updated Tinware App Development Prompt

You are tasked with creating a React application called Tinware. The app reads a CSV datafile from an S3 bucket and stores it in IndexedDB using Dexie. Please generate code for the following files, adhering to these specifications:

1. File structure:
   ```
   /src
   ├── components
   │   ├── NavBar.tsx
   │   ├── Settings.tsx
   │   ├── SelectGame.tsx
   │   └── PlayGame
   │       ├── PlayGame.tsx
   │       ├── GamePrompt.tsx
   │       ├── InputArea.tsx
   │       ├── ControlButtons.tsx
   │       ├── MessageArea.tsx
   │       └── DisplayArea.tsx
   ├── hooks
   │   └── useGameLogic.ts
   ├── services
   │   └── DataInitializer.tsx
   ├── utils
   │   ├── answerProcessor.ts
   │   └── appHelpers.ts
   ├── types
   │   └── gameTypes.ts
   ├── config
   │   └── config.ts
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

4. config.ts:
   - Define and export a CONFIG object with the following properties:
     ```typescript
     export const CONFIG = {
       DICT_URL: "https://scrabble.merriam.com/finder",
       LEXICON_NAME: "NWL23"
     };
     ```

5. gameTypes.ts:
   - Define and export interfaces for PlayGameProps, SuccessMessage, ErrorMessage, HintMessage, and GameState.
   - Ensure SuccessMessage.text, ErrorMessage.text, and HintMessage.text are of type string.
   - Update GameState to include a showRetry property of type boolean.

6. answerProcessor.ts:
   - Implement utility functions for processing answers and calculating success messages.
   - Include functions: processAnswer, processRemainingAnswers, and calculateSuccessMessage.
   - Ensure calculateSuccessMessage returns a SuccessMessage object.
   - Use the LEXICON_NAME from the CONFIG object when creating invalid answer messages.

7. appHelpers.ts:
   - Implement helper functions for App.tsx: fetchTopics, selectTopic, restartGame, and clearAppCache.
   - These functions should handle topic fetching, topic selection, game restarting, and cache clearing operations.

8. useGameLogic.ts:
   - Implement a custom hook that encapsulates the game logic.
   - Use the utility functions from answerProcessor.ts.
   - Include functions for selecting a new word, handling input changes, managing the game state, and processing the end of a round.
   - Implement a handleRetry function that resets the game state using the current answer set.
   - Update the state management to use the new message types (ErrorMessage, SuccessMessage, HintMessage).
   - Ensure new answers are added to the beginning of the displayedAnswers array.

9. DataInitializer.tsx:
   - Use Dexie for all database operations.
   - Fetch CSV data from an S3 bucket using the URL stored in the environment variable VITE_REACT_APP_CSV_URL.
   - Parse the CSV data using the Papa Parse library.
   - Store the parsed data in IndexedDB using Dexie.
   - Implement a clearCache function to remove data from IndexedDB.
   - Export the DataInitializer component, getFromIndexedDB, and clearCache functions.

10. NavBar.tsx:
    - Create a navbar component that sticks to the top of the browser window.
    - Include the title "TINWARE" in a bold, fixed-width, serif (typewriter-style) font.
    - Include a dropdown "Settings" menu at the top right of the navbar.
    - In the Settings menu, include the "Clear Cache" function.

11. SelectGame.tsx:
    - Implement a dropdown menu to select topics, including an "All Words" option.
    - Use the topics provided via props.

12. PlayGame.tsx:
    - Compose the main game interface using GamePrompt, InputArea, ControlButtons, MessageArea, and DisplayArea components.
    - Use the useGameLogic hook to manage game state and logic.
    - Handle the space key press event for moving to the next word when appropriate.
    - Pass the showRetry prop to ControlButtons.

13. GamePrompt.tsx:
    - Display the challenge instructions and word stem.
    - Show the selected topic and game type.

14. InputArea.tsx:
    - Implement an input area for a single letter, positioned before or after the root based on the current subtopic.
    - Automatically focus the input field when a new word is selected.

15. ControlButtons.tsx:
    - Implement "Skip Word"/"Next Word", "Show Hint", "No More Words", and "Retry" buttons.
    - Handle button states based on the current game state.
    - Show the "Retry" button only when showRetry is true.

16. MessageArea.tsx:
    - Display error messages, success messages, and hints.
    - Handle formatting of the root word for the "no letters" message.
    - Use the new ErrorMessage, SuccessMessage, and HintMessage types.

17. DisplayArea.tsx:
    - Show the list of answered and remaining words.
    - Use color-coding for answers: green for valid, dark gray with strikethrough for invalid, red for missed valid answers.
    - Implement hyperlinks for valid and missed answer words, linking to the Merriam-Webster Scrabble dictionary.
    - Ensure hyperlinked text appears visually identical to non-linked text.
    - Display the "can add S" information using the same styling as the root class, but smaller.

18. App.tsx:
    - Compose the main application using NavBar, DataInitializer, SelectGame, and PlayGame components.
    - Use the helper functions from appHelpers.ts for topic fetching, selection, game restarting, and cache clearing.
    - Manage the overall application state and render the appropriate components based on the current state.

19. main.tsx:
    - Set up the React application entry point.
    - Import and use PureCSS styles.
    - Import and use FontAwesome.

20. Styling (index.css):
    - Use a bold, fixed-width, serif (typewriter-style) font for root and answerWord displays.
    - Implement color-coding for different answer types as specified in DisplayArea.tsx.
    - Style the success-message, error-message, and hint-message classes appropriately.
    - Improve the styling of the input area, making it prominent and centered.
    - Enhance the appearance of the answer rows with padding, border-radius, and subtle background colors.
    - Ensure responsive design for mobile friendliness.
    - Style hyperlinks to appear visually identical to non-linked text.
    - Apply the root class styling to the "can add S" text, but with a smaller font size.

21. Game Logic Requirements:
    - Implement the gameplay logic for the "AddOne" game type as previously specified.
    - Implement case-insensitive validation for user input.
    - Display all words (root and answerWords) in uppercase and fixed-width font.
    - Update success messages as specified in the answerProcessor.ts file.
    - Implement a transition period when moving to the next word or retrying to prevent unintended actions.
    - Implement a "Show Hint" feature as previously specified.
    - Handle words without definitions as previously specified.
    - Add new answers to the beginning of the displayedAnswers array.
    - Use the LEXICON_NAME from the config when displaying "Not a valid word" messages.
    - Implement hyperlinks for valid and missed answer words, linking to the Merriam-Webster Scrabble dictionary.
    - Open dictionary links in a new browser window/tab without losing the game state.
    - Implement a "Retry" feature that allows users to restart the current word set after selecting "No More Words".

Please generate the code for these files, ensuring that they work together to create a functional Tinware app. The app should load CSV data, store it in IndexedDB using Dexie, allow users to filter data by topic, implement the gameplay logic for the "AddOne" game type, provide a way to clear the cached data, and include the new "Retry" functionality.