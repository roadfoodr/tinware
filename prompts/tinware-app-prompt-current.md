# Revised Tinware App Development Prompt

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
   - Display the first 10 rows of data in a table based on the selected topic from SelectGame.
   - Implement error handling to manage cases where data is undefined or empty.

8. App.tsx:
   - Compose the main application using NavBar, DataInitializer, SelectGame, and PlayGame components.
   - Manage the dataLoaded state to control when SelectGame and PlayGame are rendered.
   - Implement handleSelectTopic function to fetch and filter data based on the selected topic.
   - Handle cases where no data is available for a selected topic.

9. main.tsx:
   - Set up the React application entry point.
   - Import and use PureCSS styles.
   - Import and use FontAwesome.

Please generate the code for these files, ensuring that they work together to create a functional Tinware app. The app should load CSV data, store it in IndexedDB using Dexie, allow users to filter data by topic, display the data in a table, and provide a way to clear the cached data.

Key changes from the original prompt:
- Added db.ts file for Dexie configuration.
- Updated DataInitializer to use Dexie instead of direct IndexedDB calls.
- Modified SelectGame and PlayGame to work with Dexie and handle potential data issues.
- Updated App.tsx to manage data flow between components and handle edge cases.
- Ensured consistent use of Dexie throughout the application for all database operations.