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
     - Display the prompt "Which letters go [before|after] the following word stem?"
     - Show the root word in uppercase and fixed-width font.
     - Provide an input area for a single letter, positioned before or after the root based on the current subtopic.
     - Validate user input against the set of unique values in the "answer" column of the current answerSet.
     - Display valid and invalid entries in a display area below the input.
     - Use color-coding for answers: green for valid, dark gray with strikethrough for invalid, red for missed valid answers.
     - Implement "No More Words" and "Skip Word" buttons.
     - After clicking "No More Words", hide the input area and change the "Skip Word" button to "Next word".
     - Ensure no repeated rows in the display area.
   - Use a useRef hook to automatically focus the input field when a new word is selected.
   - Implement case-insensitive validation for user input.
   - Display all words (root and answerWords) in uppercase and fixed-width font.

8. App.tsx:
   - Compose the main application using NavBar, DataInitializer, SelectGame, and PlayGame components.
   - Manage the dataLoaded state to control when SelectGame and PlayGame are rendered.
   - Implement handleSelectTopic function to fetch and filter data based on the selected topic.
   - Handle cases where no data is available for a selected topic.
   - Implement a handleRestart function to reset the game state.
   - Implement a handleClearCache function to clear the database and reset the app state.

9. main.tsx:
   - Set up the React application entry point.
   - Import and use PureCSS styles.
   - Import and use FontAwesome.

10. Styling:
    - Add styles to index.css or App.css to support the new PlayGame requirements:
      - Use a bold, fixed-width, serif (typewriter-style) font for root and answerWord displays.
      - Implement color-coding for different answer types (green for valid, dark gray with strikethrough for invalid, red for missed).

Please generate the code for these files, ensuring that they work together to create a functional Tinware app. The app should load CSV data, store it in IndexedDB using Dexie, allow users to filter data by topic, implement the gameplay logic for the "AddOne" game type, and provide a way to clear the cached data.

Key changes from the previous implementation:
- Updated PlayGame component to implement the new gameplay logic for the "AddOne" game type.
- Added case-insensitive validation for user input.
- Implemented the display of words in uppercase.
- Added functionality to hide the input area and change button labels after "No More Words" is clicked.
- Ensured no repeated rows in the display area of PlayGame.
- Updated App component to handle game restarts and cache clearing.
- Added styling requirements for consistent display of words and color-coding of answers.