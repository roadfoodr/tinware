# Tinware Functional Specification Document

## 1. Introduction

This Functional Specification Document (FSD) outlines the detailed functionality of the Tinware application, with a focus on the scenario-based gameplay and user interactions in various game states.

## 2. System Overview

Tinware is a web-based educational word game that challenges users to identify valid words by adding letters before or after a given word stem. The application uses React for the frontend, with data stored in IndexedDB using Dexie.

## 3. Data Structure

### 3.1 Word Item Structure
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
  canAddS: string;
  scenarioID: string;
}
```

### 3.2 Formatted Answer Structure
```typescript
interface FormattedAnswer extends WordItem {
  formattedDefinition: string;
  takesS: string;
  isRemaining?: boolean;
  isRootWithNoLetters?: boolean;
}
```

## 4. User Interface Components

### 4.1 NavBar
- Displays the Tinware logo and title
- Contains a Settings dropdown menu with a "Clear Cache" option

### 4.2 SelectGame
- Dropdown menu for topic selection
- Includes "All Words" option and all available topics
- Initiates game start upon topic selection

### 4.3 PlayGame
- Main game interface composed of:
  - GamePrompt
  - InputArea
  - ControlButtons
  - MessageArea
  - DisplayArea

## 5. Gameplay Flow and Messaging

### 5.1 Game Initialization

#### 5.1.1 Topic Selection
- User selects a topic from the dropdown menu
- System filters word data based on the selected topic
- A random scenario is selected from the filtered data
- If no data is available for the selected topic:
  ```
  Message: "No data available for the selected topic."
  ```

#### 5.1.2 Scenario Selection
- System randomly selects a scenario from the filtered data
- If no valid scenarios are found:
  ```
  Message: "No valid scenarios found for the selected topic and gametype."
  ```

### 5.2 Gameplay

#### 5.2.1 Game Prompt
- Display the selected topic
- For "AddOne" game type:
  ```
  Prompt: "Which letters go [before|after] the word stem?"
  ```
  Where [before|after] is determined by the `subtopic` field of the current scenario.

#### 5.2.2 User Input Processing
- Valid input: Single alphabetic character (case-insensitive)
- Invalid input: Ignored silently (no error message)
- Space key: Treated as "No More Words" action

#### 5.2.3 Answer Validation
- If the input forms a valid word:
  - Display the word in the DisplayArea with its definition
  - Format: `[WORD]: [Definition]`
  - If `canAddS` is true:
    ```
    Additional info: "can add S: [WORD]S"
    ```
  - If `canAddS` is false and word doesn't end in 'S':
    ```
    Additional info: "can not add S"
    ```
  - If `canAddS` is false and word ends in 'S':
    ```
    Additional info: "already ends in S"
    ```
  - The word is displayed as a hyperlink to the Merriam-Webster Scrabble dictionary
- If the input forms an invalid word:
  - Display the word in the DisplayArea
  - Format: `[WORD]: Not a valid word in [LEXICON_NAME]`
  - Where [LEXICON_NAME] is specified in the config (default: "NWL23")
- New answers (valid or invalid) are added to the beginning of the display list
- No explicit "Valid word" message is displayed for correct guesses

#### 5.2.4 Hint System
- When "Show Hint" is clicked, display in MessageArea:
  ```
  Message: "Hint: [hint text from WordItem]"
  ```
- If no hint is available:
  ```
  Message: "Hint: There are [X] possibilities."
  ```
  Where [X] is the count of valid answers for the current scenario.
- The "Show Hint" button is disabled when a hint is already being displayed

### 5.3 End of Round

#### 5.3.1 No More Words
When user indicates no more words or all valid words have been found:

- If there are no valid answers (root word only):
  ```
  Message: "There are no letters that can go [before|after] [ROOT]."
  ```
  Where [ROOT] is displayed in uppercase.

- If all words were correctly identified:
  ```
  Message: "You correctly identified all [X] word(s)!"
  ```
  Where [X] is the total number of valid words.

- If some words were missed:
  ```
  Message: "You identified [Y] out of [X] word(s)"
  ```
  Where [Y] is the number of correctly identified words and [X] is the total number of valid words.

#### 5.3.2 Displaying Remaining Words
- Show any unidentified valid words in the DisplayArea
- Format: `[WORD]: [Definition]`
- Remaining words are added to the beginning of the display list

#### 5.3.3 Retry Option
- After "No More Words" is selected, a "Retry" button becomes visible
- When clicked, it resets the game state using the current scenario, allowing the user to try again with the same word set

### 5.4 Transition to Next Word
- Brief transition period (defined in CONFIG.GAME.TRANSITION_DELAY_MS) where input is disabled
- New scenario is selected and displayed

### 5.5 Retry Transition
- Brief transition period (defined in CONFIG.GAME.TRANSITION_DELAY_MS) where input is disabled
- Same scenario is reset and displayed

### 5.6 Message Display Hierarchy
- Messages are displayed in the following order of priority:
  1. Hints (when shown)
  2. Error messages (e.g., for invalid words)
  3. Success messages (e.g., end of round summary)
- Only one type of message is displayed at a time

## 6. User Interface Components

### 6.1 DisplayArea
- Shows the list of answered and remaining words
- Uses color-coding for answers: 
  - Green for valid
  - Dark gray with strikethrough for invalid
  - Red for missed valid answers
- Displays words as hyperlinks to the Merriam-Webster Scrabble dictionary for valid and missed answers

### 6.2 MessageArea
- Handles the display of hints, error messages, and success messages
- Ensures proper ordering of messages as per the Message Display Hierarchy

### 6.3 ControlButtons
- Includes "Skip Word"/"Next Word", "Show Hint", "No More Words", and "Retry" buttons
- The "Show Hint" button is disabled when:
  - A hint is already being displayed
  - No hint is available for the current scenario
- The "Skip Word" button changes to "Next Word" after the end of a round
- The "Retry" button appears after the end of a round

### 6.4 InputArea
- Displays a single-letter input field
- Positions the input field before or after the root word based on the current scenario's subtopic

## 7. Game State Management

### 7.1 useGameLogic Hook
- Manages the overall game state
- Handles user input processing
- Manages the display and hiding of hints
- Handles the transition between scenarios and rounds
- Implements retry functionality for repeating a scenario

## 8. Data Management

### 8.1 Data Loading
- CSV data is loaded from an S3 bucket
- Data is parsed and stored in IndexedDB using Dexie
- Subsequent app launches use cached data unless cleared

### 8.2 Cache Clearing
- Users can clear the cached data through the Settings menu
- Clearing cache reloads data from the S3 bucket

## 9. Error Handling

### 9.1 Data Loading Errors
If there's an error fetching or processing the CSV file:
```
Message: "Failed to fetch or process the CSV file: [error message]"
```

### 9.2 IndexedDB Errors
If there's an error storing data in IndexedDB:
```
Message: "Error storing data in IndexedDB: [error message]"
```

## 10. Performance Considerations

### 10.1 Data Caching
- CSV data is cached in IndexedDB after initial load
- Subsequent app launches use cached data unless cleared

### 10.2 Transition Timing
- Transition period between scenarios is defined in CONFIG.GAME.TRANSITION_DELAY_MS

## 11. Accessibility

### 11.1 Keyboard Navigation
- Space key can be used to progress to the next word when appropriate

### 11.2 Color Coding
- Use of color is supplemented with text or symbols to ensure accessibility for color-blind users

## 12. Responsiveness

The UI should adapt to different screen sizes:
- Desktop: Full layout with side-by-side components
- Tablet: Vertically stacked components with full width
- Mobile: Simplified layout with scrollable sections

## 13. Configuration

### 13.1 Global Configuration
- A centralized configuration file (config.ts) contains global settings:
  - DICT_URL: URL for the Merriam-Webster Scrabble dictionary
  - LEXICON_NAME: Name of the current lexicon (e.g., "NWL23")
  - GAME.TRANSITION_DELAY_MS: Duration of transition delay between scenarios

This Functional Specification Document provides a comprehensive breakdown of Tinware's functionality, with a particular focus on the scenario-based gameplay, user interactions, and component behaviors in various game states. It outlines the specific behaviors, error handling, and user interface elements that make up the Tinware experience, including the scenario selection, retry functionality, and centralized configuration for timing-related operations.