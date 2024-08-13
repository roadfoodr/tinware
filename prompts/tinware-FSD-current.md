# Tinware Functional Specification Document

## 1. Introduction

Tinware is a React-based web application designed to help users practice and improve their knowledge of word lists through interactive word games. The application currently features two game types: AddOne and BingoStem, with a modular structure to facilitate the addition of new game types in the future.

## 2. System Overview

Tinware is built using React with TypeScript for the frontend, with data stored in IndexedDB using Dexie.js. The system employs a context-based state management approach for improved modularity and scalability.

### 2.1 Key Technologies

- React with TypeScript
- Dexie.js for IndexedDB interactions
- PureCSS for styling
- FontAwesome for icons
- use-sound library for audio feedback

## 3. Application Structure

### 3.1 Main Components

- App: The root component that manages the overall application state and routing.
- GameProvider: Wraps the game components and provides the GameContext.
- NavBar: Displays the Tinware logo, title, and contains the Settings menu.
- SelectGame: Allows users to choose a topic and start the game.
- PlayGame: Orchestrates the gameplay and manages game-specific logic.
- GameContainer: The main game interface that composes all game components. It also handles keyboard events for game control, including spacebar functionality and the '?' key for hint activation.

### 3.2 Game-Specific Components

- AddOneGame: Implements the AddOne game type.
- BingoStemGame: Implements the BingoStem game type.

### 3.3 Shared Components

- GamePrompt: Displays instructions and current game information.
- InputArea: Renders the appropriate input component based on game type.
- ControlButtons: Provides game control buttons.
- MessageArea: Displays error messages, success messages, and hints.
- DisplayArea: Shows the list of answered and remaining words.

### 3.4 Custom Hooks

- useGameManager: Centralizes game management logic, including scenario selection and game type management.
- useGameContext: Provides access to the centralized game state.
- useCommonGameLogic: Handles shared game logic across different game types.
- useAddOneLogic: Implements AddOne game-specific logic.
- useBingoStemLogic: Implements BingoStem game-specific logic.
- useGameInput: Manages input handling for both game types.
- useSounds: Manages sound playback for game events.

### 3.5 Utility Functions

- GameUtils.ts: Contains shared utility functions used across different game types:
  - isValidLetterCombination: Validates letter combinations for BingoStem game.
  - processRemainingAnswers: Processes remaining answers after a game round.
  - calculateSuccessMessage: Generates success messages based on game results.
  - getRandomScenario: Selects a random scenario, ensuring it's different from the previous one.
  - processScenarioData: Prepares and standardizes raw scenario data for use in the game.

- answerProcessor.ts: Contains functions specific to processing answers:
  - formatAnswer: Formats a word item into a displayable answer.
  - processAnswer: Processes a user's answer input.

## 4. Data Structure

### 4.1 Word Item Structure
```typescript
interface WordItem {
  id: number;
  taskID: string;
  scenarioID: string;
  topic: string;
  gametype: string;
  subtopic: string;
  root: string;
  answer: string;
  answerWord: string;
  hint: string;
  definition: string;
  canAddS: boolean;
}
```

### 4.2 Formatted Answer Structure
```typescript
interface FormattedAnswer extends WordItem {
  formattedDefinition: string;
  takesS: string;
  isRemaining?: boolean;
  isRootWithNoLetters?: boolean;
}
```

### 4.3 Game State Structure
```typescript
interface GameState {
  answerSet: FormattedAnswer[];
  userInput: string;
  displayedAnswers: FormattedAnswer[];
  showAllAnswers: boolean;
  skipButtonLabel: string;
  errorMessage: ErrorMessage | null;
  successMessage: SuccessMessage | null;
  hint: HintMessage | null;
  showHint: boolean;
  isTransitioning: boolean;
  shouldFocusInput: boolean;
  showRetry: boolean;
  gameType: GameType;
  invalidSubmissionCount: number;
  lastHintType: 'count' | 'definition' | null;
  hintCount: number;
  score: number | null;
}
```

## 5. Game Flow and User Interaction

### 5.1 Game Initialization

1. User selects a topic from the dropdown menu.
2. System filters word data based on the selected topic.
3. A random scenario is selected from the filtered data.
4. The appropriate game type is determined based on the scenario.
5. The GameContext is initialized with the game state.

### 5.2 Game Controls

The game controls are presented in the following order, with visibility dependent on the game state:

1. Skip Word: Visible before "No More Words" is pressed.
2. Retry: Visible after "No More Words" is pressed.
3. Show Hint: Visible before "No More Words" is pressed.
4. No More Words: Visible before it's pressed.
5. Next Word: Visible after "No More Words" is pressed.

### 5.3 Input Handling

#### 5.3.1 AddOne Game

- The input area accepts a single letter input.
- After each input (valid, invalid, or repeated):
  - The input area is cleared immediately.
  - The focus remains on the input area for the next entry.
- For valid new entries:
  - The word is displayed in the answer list.
  - No error message is shown.
- For invalid new entries:
  - An error message is displayed.
  - The invalid word is added to the answer list (marked as invalid).
- For repeated entries (valid or invalid):
  - No change is made to the answer list.
  - No error message is displayed.
  - The user can immediately enter a new letter.

#### 5.3.2 BingoStem Game

- The input area accepts a 7-letter word.
- The user must use the given rack (root word + additional letter) to form words.
- The user input is pre-checked: if the 7 letters entered are not the same letters and letter counts as the given rack, a hint is issued, input is cleared and refocused.
- Validation occurs when the user submits a 7-letter word that passes the pre-check.
- Invalid or repeated entries are handled similarly to the AddOne game.

### 5.4 Answer Processing

- Valid answers are displayed in the DisplayArea component.
- Invalid answers are shown with an error message and added to the DisplayArea (marked as invalid).
- Repeated entries are ignored, and the input is cleared.
- The processAnswer function in answerProcessor.ts handles the core logic for processing user inputs.

### 5.5 Game Completion

1. The `processRemainingAnswers` function from `GameUtils.ts` is used to reveal remaining valid words in the DisplayArea.
2. The score is calculated using the `calculateScore` function from `GameUtils.ts`.
3. A success message is generated using the `calculateSuccessMessage` function from `GameUtils.ts`.
4. The appropriate sound (scenarioSuccess or scenarioComplete) is played based on the score.

### 5.6 Hint Functionality

- The "Show Hint" button is available before "No More Words" is pressed.
- Hints can also be activated by pressing the '?' key when the "Show Hint" button is active.
- The hint system alternates between two types of hints:
  1. Count hint: Displays the number of identified valid answers and the total count of possible valid words.
  2. Definition hint: Shows the definition of a random unidentified word.
- When the hint is displayed:
  - The hint text appears in the message area.
  - The focus automatically returns to the input area after a short delay.
  - The "Show Hint" button remains active, allowing for consecutive hint requests.
- If there are no valid words for the current scenario, the hint displays "There are no possible valid words".
- The type of hint (count or definition) is stored in the game state as `lastHintType` to determine which type to show next.
- Each time a hint is requested, the `hintCount` in the game state is incremented.
- The hint count is used in the score calculation to apply a penalty for using hints.

### 5.7 Keyboard Controls

- Spacebar: 
  - When the input field is focused and not all answers are shown: Activates the "No More Words" function.
  - When all answers are shown: Activates the "Next Word" function.
- '?' key: Activates the "Show Hint" function when it's available (before "No More Words" is pressed).

### 5.8 Retry Functionality

- The "Retry" button is available after "No More Words" is pressed.
- When Retry is activated, the same scenario is restarted.

### 5.9 Next Word Functionality

- The "Next Word" button is available after "No More Words" is pressed.
- When Next Word is activated, a new scenario in the current topic is selected, ensuring it's different from the previous scenario.

### 5.10 Focus Management

- The input area receives focus:
  - At the start of a new game scenario.
  - After displaying a hint.
  - When transitioning between words.
- Focus is managed using React's `useRef` and `useEffect` hooks to ensure proper timing and component lifecycle management.

## 6. State Management

### 6.1 GameContext

The GameContext provides centralized state management for the entire game. It includes:

- `gameState`: An object containing the current state of the game, including:
  - `answerSet`: The current set of answers for the scenario.
  - `userInput`: The current user input.
  - `displayedAnswers`: The answers that have been displayed to the user.
  - `showAllAnswers`: A boolean indicating whether all answers should be shown.
  - `skipButtonLabel`: The label for the skip button.
  - `errorMessage`: Any error message to display.
  - `successMessage`: Any success message to display.
  - `hint`: The current hint, if any.
  - `showHint`: A boolean indicating whether to show the hint.
  - `isTransitioning`: A boolean indicating if the game is in a transitioning state.
  - `shouldFocusInput`: A boolean indicating if the input should be focused.
  - `showRetry`: A boolean indicating if the retry option should be shown.
  - `gameType`: The current game type (AddOne or BingoStem).
  - `invalidSubmissionCount`: The count of invalid submissions.
  - `lastHintType`: The type of the last hint shown.
  - `hintCount`: The number of hints requested in the current scenario.
  - `score`: The calculated score for the current scenario.

- `currentScenario`: The current scenario being played.
- `setCurrentScenario`: A function to update the current scenario.
- `setGameState`: A function to update the game state.
- `selectedTopic`: The currently selected topic.
- `setSelectedTopic`: A function to update the selected topic.

The GameContext is accessible through the useGameContext hook, which provides access to these state variables and functions throughout the application.

### 6.2 Game Logic Hooks

- useCommonGameLogic: Handles shared game logic (e.g., showing hints, transitioning between words).
- useAddOneLogic and useBingoStemLogic: Implement game-specific logic.
- useGameInput: Manages input handling for both game types.
- useGameManager: New hook that centralizes game management, including scenario selection and game type management.

## 7. Data Management

### 7.1 Data Loading

- CSV data is loaded from an S3 bucket.
- Data is parsed and stored in IndexedDB using Dexie.
- Subsequent app launches use cached data unless cleared.

### 7.2 Cache Clearing

- Users can clear the cached data through the Settings menu.

## 8. Configuration

A centralized configuration file (config.ts) contains global settings and game-specific parameters:

- Dictionary URL
- Lexicon name
- Transition delay times
- Game-specific settings (e.g., BingoStem input length)

## 9. Accessibility

- Proper ARIA labels are used for input fields to improve screen reader compatibility.
- Focus management ensures that users can navigate the game using a keyboard.
- Color contrast ratios meet accessibility standards.

## 10. Responsiveness

The UI adapts to different screen sizes:
- Desktop: Full layout with side-by-side components.
- Tablet: Vertically stacked components with full width.
- Mobile: Simplified layout with scrollable sections.

## 11. Sound System

### 11.1 Sound Types

Tinware includes five types of sounds to provide audio feedback for various game events:

1. Valid Word Sound: Played when a user enters a valid word.
2. Invalid Word Sound: Played when a user enters an invalid word.
3. Scenario Success Sound: Played when a user successfully completes a scenario by identifying all valid words without any invalid submissions.
4. Scenario Complete Sound: Played when a user completes a scenario (by pressing "No More Words") but hasn't met the criteria for scenario success.
5. Hint Requested Sound: Played when a user requests a hint.

### 11.2 Sound Management

- Sounds are managed using the `useSounds` custom hook, which utilizes the `use-sound` library.
- The `AppSettingsContext` includes a sound toggle feature, allowing users to turn game sounds on or off.
- A UI control is provided in the Settings menu, accessible from the NavBar, allowing users to toggle sounds on or off during gameplay.
- The sound toggle is represented by a button with appropriate icons (e.g., speaker icon for sound on, muted speaker for sound off) and text indicating the current state.
- Sound preferences are persisted in local storage to remember user settings between sessions.

### 11.3 Sound Playback Logic

- In both AddOne and BingoStem game modes, appropriate sounds are played when processing user input for valid or invalid words.
- The scenario success sound is played when all valid words in a scenario have been identified without any invalid submissions.
- The scenario complete sound is played when a user finishes a scenario but hasn't met the criteria for full success.
- The hint requested sound is played when a user clicks the "Show Hint" button.
- Only one sound plays at a time; any currently playing sound is stopped before a new one starts.

### 11.4 Implementation Details

- Sound files are stored in the `assets` folder and imported into the `useSounds` hook.
- The `playSound` function in the `useSounds` hook handles all sound playback, checking if sound is enabled in the app settings before playing.
- Game logic in `useCommonGameLogic`, `useAddOneLogic`, and `useBingoStemLogic` hooks determines when to trigger sound playback based on game events.

## 12. Scenario Selection

The scenario selection process ensures a varied gaming experience:

- The `getRandomScenario` function in `GameUtils.ts` selects a random scenario while avoiding the immediately previous scenario.
- The `useGameManager` hook keeps track of the previous scenario ID to facilitate this selection process.
- When a new topic is selected, the previous scenario ID is reset, allowing any scenario to be selected for the new topic.
- The `handleSkipWord` function in `useGameManager` ensures that skipping a word or moving to the next word after completion always results in a different scenario being selected (if multiple scenarios are available).

## 13. Scoring System

The application now includes a scoring system to evaluate user performance in each scenario:

### 13.1 Score Calculation

The score is calculated using the following formula:

```
score = (effectiveValidWords * 100) / (effectiveValidWords + wordsMissed + invalidWordsGuessed + 0.5 * hintsRequested)
```

Where:
- `effectiveValidWords` is the number of valid words identified by the user, or 1 if there are no valid words in the scenario.
- `wordsMissed` is the number of valid words not identified by the user.
- `invalidWordsGuessed` is the number of invalid words guessed by the user.
- `hintsRequested` is the number of hints requested by the user.

### 13.2 Handling Scenarios with No Valid Words

- In scenarios with no valid words, the scoring system treats it as if there was one valid word identified.
- This approach ensures consistency in scoring across all scenarios, including those with no valid words.

### 13.3 Score Display

- The calculated score is included in the success message displayed at the end of each scenario.
- The score is displayed as an integer between 0 and 100.

### 13.4 Perfect Score

- A score of 100 is achieved when the user identifies all valid words (or correctly identifies that there are no valid words) without making any invalid guesses or requesting any hints.
- When a perfect score is achieved, the 'scenarioSuccess' sound is played instead of the 'scenarioComplete' sound.

## 14. Data Processing

- The `processScenarioData` function in `GameUtils.ts` prepares and standardizes raw scenario data before use in the game:
  - Ensures `answerWord` is uppercase and `definition` is a string.
  - Converts `canAddS` to a boolean value for consistent handling throughout the game.

## 15. Future Enhancements

- Implementation of additional game types (e.g., Flashcard, Unscramble).
- User accounts and progress tracking across sessions.
- Leaderboards and social features.
- Adaptive learning algorithm to personalize word difficulty.

## 16. Error Handling and Logging

- Comprehensive error messages for user feedback.
- Error logging for debugging and improvement.
- Graceful degradation in case of data loading failures.

## 17. Security Considerations

- Secure handling of user data (for future user account feature).
- Protection against common web vulnerabilities (XSS, CSRF).
- Regular security audits and updates.

This Functional Specification Document provides a comprehensive overview of the refactored Tinware application, including its functionality, structure, and future plans. It serves as a guide for development, maintenance, and future enhancements of the application.