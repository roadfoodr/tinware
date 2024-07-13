# Tinware Functional Specification Document

## 1. Introduction

This Functional Specification Document (FSD) outlines the detailed functionality of the Tinware application, with a particular focus on the messaging system and user interactions in various scenarios.

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
  canAddS: number;
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
- If no data is available for the selected topic:
  ```
  Message: "No data available for the selected topic."
  ```

#### 5.1.2 Word Selection
- System randomly selects a word stem from the filtered data
- If no valid combinations are found:
  ```
  Message: "No valid combinations found for the selected topic and gametype."
  ```

### 5.2 Gameplay

#### 5.2.1 Game Prompt
- Display the selected topic and game type
- For "AddOne" game type:
  ```
  Prompt: "Which letters go [before|after] the following word stem?"
  ```
  Where [before|after] is determined by the `subtopic` field of the current word set.

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
  - If [LEXICON_NAME] is not available, use "this lexicon"
- New answers (valid or invalid) are added to the beginning of the display list

#### 5.2.4 Hint System
- When "Show Hint" is clicked, display in MessageArea:
  ```
  Message: "Hint: [hint text from WordItem]"
  ```
- If no hint is available:
  ```
  Message: "Hint: There are [X] possibilities."
  ```
  Where [X] is the count of valid answers for the current word stem.

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
  Message: "You correctly identified all [X] words!"
  ```
  Where [X] is the total number of valid words.

- If some words were missed:
  ```
  Message: "You identified [Y] out of [X] words"
  ```
  Where [Y] is the number of correctly identified words and [X] is the total number of valid words.

#### 5.3.2 Displaying Remaining Words
- Show any unidentified valid words in the DisplayArea
- Format: `[WORD]: [Definition]`
- Remaining words are added to the beginning of the display list

### 5.4 Transition to Next Word
- Brief transition period (300ms) where input is disabled
- New word stem is selected and displayed

## 6. Error Handling

### 6.1 Data Loading Errors
If there's an error fetching or processing the CSV file:
```
Message: "Failed to fetch or process the CSV file: [error message]"
```

### 6.2 IndexedDB Errors
If there's an error storing data in IndexedDB:
```
Message: "Error storing data in IndexedDB: [error message]"
```

## 7. Performance Considerations

### 7.1 Data Caching
- CSV data is cached in IndexedDB after initial load
- Subsequent app launches use cached data unless cleared

### 7.2 Transition Timing
- 300ms transition period between words to prevent unintended actions

## 8. Accessibility

### 8.1 Keyboard Navigation
- Space key can be used to progress to the next word when appropriate

### 8.2 Color Coding
- Use of color is supplemented with text or symbols to ensure accessibility for color-blind users

## 9. Responsiveness

The UI should adapt to different screen sizes:
- Desktop: Full layout with side-by-side components
- Tablet: Vertically stacked components with full width
- Mobile: Simplified layout with scrollable sections

## 10. Styling

### 10.1 Answer Display
- Valid and missed answers: Green and red backgrounds respectively
- Invalid answers: Gray background with strikethrough text
- All answer words: Bold, uppercase, fixed-width font

### 10.2 Hyperlinks
- Valid and missed answer words are hyperlinked to the Merriam-Webster Scrabble dictionary
- Hyperlinks open in a new browser tab/window
- Hyperlinked text appears visually identical to non-linked text

### 10.3 "Can Add S" Display
- Displayed using the same styling as the answer word (bold, uppercase, fixed-width)
- Smaller font size than the answer word
- Color-coded based on answer status (valid, missed, or default)

This Functional Specification Document provides a detailed breakdown of Tinware's functionality, with a particular focus on the messaging system, user interactions, and styling in various scenarios. It outlines the specific behaviors, error handling, and user interface elements that make up the Tinware experience.