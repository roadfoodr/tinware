# Tinware Product Requirements Document

## 1. Introduction

Tinware is an educational word game application designed to help users improve their vocabulary and language skills. The game challenges players to identify valid words using different game modes, currently featuring AddOne and BingoStem, with plans to include Flashcard and Unscramble modes, all using a scenario-based approach.

## 2. Purpose

The primary purpose of Tinware is to:
- Enhance users' vocabulary and word recognition skills
- Provide an engaging and interactive learning experience
- Offer a customizable learning journey through various topics and scenarios
- Support multiple game modes to cater to different learning styles and preferences
- Facilitate easy expansion with new game types and features

## 3. Target Audience

- Language learners (ESL students, vocabulary enthusiasts)
- Educators and students
- Word game enthusiasts
- Anyone looking to improve their language skills

## 4. Key Features

### 4.1 Topic Selection
- Users can choose from a variety of topics or select "All Words" for a broader challenge
- Topics are clearly displayed and easily selectable
- Game starts immediately upon topic selection

### 4.2 Scenario-based Gameplay
- Players are presented with word scenarios based on the selected topic
- Each scenario challenges players to identify valid words based on the current game mode
- The game supports multiple game types, including AddOne and BingoStem, with Flashcard and Unscramble planned for future implementation

### 4.3 Game Modes

#### 4.3.1 AddOne
- Players add a single letter before or after a given word stem
- Immediate feedback on each letter input
- Input area clears after each entry, allowing for quick successive attempts
- Handles repeated entries by clearing input without changing the display

#### 4.3.2 BingoStem
- Players enter seven letters to form words (bingos) with a given rack
- Rack consists of a root word plus one additional letter
- Players submit their seven-letter word for validation

### 4.4 User Interface
- Clean, intuitive design with a responsive layout
- Prominent display of the current challenge and word stem or rack
- Game-type specific input areas adapted for each mode
- Consistent design language across all game types
- Clear visual feedback for hint activation and display
- Keyboard shortcut reminders for enhanced usability

### 4.5 Feedback System
- Real-time feedback on user inputs
- Comprehensive end-of-round summary
- Invalid word messages include the name of the current lexicon
- Success messages tailored to each game type and scenario outcome
- Display of calculated score at the end of each scenario

### 4.6 Hint System
- Optional hints to assist players when stuck
- Two types of hints that alternate:
  1. Count hint: Shows the number of identified words and total possible valid words
  2. Definition hint: Displays the definition of a random unidentified word
- "Show Hint" button remains active after displaying a hint, allowing for consecutive hint requests
- Hint can be activated via the "Show Hint" button or by pressing the '?' key
- Game-type specific hints where appropriate
- Focus returns to input area after displaying hint
- If no valid words are possible, the hint informs the user
- Each hint request is tracked and factors into the score calculation

### 4.7 Progress Tracking
- Display of correct answers and remaining possibilities
- Color-coded answers for easy identification (green for valid, gray for invalid, red for missed)
- Score calculation and display at the end of each scenario
- Cumulative scoring system across game types and scenarios (future enhancement)

### 4.8 Dictionary Integration
- Valid and missed answer words are hyperlinked to an online Scrabble dictionary
- Dictionary links open in a new browser tab/window

### 4.9 Settings and Customization
- Option to clear cached data
- Centralized configuration for game settings (e.g., transition delays, input lengths)
- Sound toggle feature allowing users to turn game sounds on or off
- Future: User preferences for difficulty levels and game type priorities

### 4.10 Game Controls
- Consistent order of control buttons across game types
- Dynamic visibility of buttons based on game state
- "Skip Word" button available before revealing all answers
- "Retry" button appears after all answers are revealed
- Keyboard controls for essential game actions:
  - Spacebar: Activates "No More Words" (before revealing answers) or "Next Word" (after revealing answers)
  - '?' key: Activates "Show Hint" when available

### 4.11 Sound System
- Provides audio feedback for key game events to enhance user engagement
- Includes five distinct sound types:
  1. Valid Word Sound: Played when a user enters a correct word
  2. Invalid Word Sound: Played when a user enters an incorrect word
  3. Scenario Success Sound: Played when a user completes a scenario perfectly
  4. Scenario Complete Sound: Played when a user finishes a scenario but doesn't meet all success criteria
  5. Hint Requested Sound: Played when a user asks for a hint
- Sound toggle control in the Settings menu allows users to easily turn sounds on or off
- Sound preferences are remembered between sessions
- Ensures only one sound plays at a time to avoid audio overlap

### 4.12 Scenario Selection and Progression

- The game ensures variability in scenario selection by avoiding immediate repetition of scenarios.
- When progressing to a new scenario (via "Skip Word" or "Next Word"), the system selects a different scenario from the current topic.
- If only one scenario is available for a topic, the system will reuse it but inform the user.
- The scenario selection process is designed to provide a balanced and engaging progression through the available content.

### 4.13 Data Management and Processing

- Raw scenario data is processed and standardized before use in the game.
- The system handles various data formats and ensures consistency in data types (e.g., converting string representations to appropriate boolean values).
- Data processing includes proper capitalization of words and standardization of optional fields.

## 5. Scoring System Requirements

### 5.1 Score Calculation
- Calculate score using the formula: (effectiveValidWords * 100) / (effectiveValidWords + wordsMissed + invalidWordsGuessed + 0.5 * hintsRequested)
- Handle scenarios with no valid words by treating them as if one valid word was identified
- Ensure consistent scoring across all scenario types (AddOne and BingoStem)

### 5.2 Score Display
- Include the calculated score in the success message at the end of each scenario
- Display the score as an integer between 0 and 100

### 5.3 Perfect Score
- Award a score of 100 for perfect performance (all valid words identified or correctly identifying no valid words, with no invalid guesses or hints used)
- Play a special success sound for perfect scores


## 6. Technical Requirements

### 6.1 Frontend
- Developed using React with TypeScript
- Responsive design using PureCSS for styling
- FontAwesome for icons

### 6.2 State Management
- Utilizes React Context API for centralized state management
- Implements a useGameManager hook to centralize game logic and state management
- Manages game state including hint count, score, last hint type for alternating hint functionality, and previous scenario for varied scenario selection

### 6.3 Data Storage
- IndexedDB for client-side data storage using Dexie.js
- Initial data loaded from CSV file hosted on S3

### 6.4 Build and Development
- Vite as the build tool for fast development and optimized production builds

### 6.5 Extensibility
- Modular architecture allowing easy addition of new game types
- Centralized configuration for game parameters
- Clear separation of concerns between game utilities, answer processing, and core game logic

### 6.6 Audio
- Implements the use-sound library for managing and playing game sounds
- Supports multiple audio file formats for cross-browser compatibility

## 7. Future Enhancements

- Implementation of Flashcard and Unscramble game types
- User accounts and progress tracking across sessions
- Implement a global leaderboard or personal best tracking system based on the scoring feature
- Customizable difficulty levels
- Adaptive learning algorithm to personalize word difficulty
- Enhanced scenario selection algorithm to ensure a balanced distribution of different game types and difficulty levels across play sessions
- Enhanced hint system with more varied hint types and difficulty levels
- User-customizable hint preferences

## 8. Performance Requirements

- Initial load time under 3 seconds on average broadband connection
- Smooth transitions between words and game types (< 300ms)
- Efficient scenario selection and data processing to maintain quick transitions between words and scenarios (< 300ms)
- Efficient data caching to minimize network requests
- Optimized rendering to maintain 60 FPS during gameplay

## 9. User Experience Requirements

- Provide seamless transitions between scenarios, maintaining user engagement
- Ensure variety in gameplay by avoiding repetition of scenarios within a session
- Clearly communicate to users when all scenarios for a topic have been completed
- Offer intuitive navigation between different game types and difficulty levels
- Provide clear and encouraging feedback on user performance through the scoring system and tailored success messages

## 10. Security Requirements

- Secure handling of user data (for future user account feature)
- Protection against common web vulnerabilities (XSS, CSRF)
- Regular security audits and updates


This Product Requirements Document outlines the core features, technical requirements, and future direction of Tinware. It reflects the modular and extensible architecture, emphasizing the multi-game type support and centralized state management. The document serves as a guide for development priorities, ensuring that Tinware continues to evolve as an effective and engaging educational tool.
