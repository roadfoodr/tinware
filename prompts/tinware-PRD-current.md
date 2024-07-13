# Tinware Product Requirements Document

## 1. Introduction

Tinware is an educational word game application designed to help users improve their vocabulary and language skills. The game challenges players to identify valid words by adding letters before or after a given word stem.

## 2. Purpose

The primary purpose of Tinware is to:
- Enhance users' vocabulary and word recognition skills
- Provide an engaging and interactive learning experience
- Offer a customizable learning journey through various topics and challenges

## 3. Target Audience

- Language learners (ESL students, vocabulary enthusiasts)
- Educators and students
- Word game enthusiasts
- Anyone looking to improve their language skills

## 4. Key Features

### 4.1 Topic Selection
- Users can choose from a variety of topics or select "All Words" for a broader challenge
- Topics are clearly displayed and easily selectable

### 4.2 Gameplay
- Players are presented with a word stem and must identify valid words by adding letters before or after the stem
- The game supports multiple game types, with the current implementation focusing on the "AddOne" game type

### 4.3 User Interface
- Clean, intuitive design with a responsive layout
- Prominent display of the current challenge and word stem
- Easy-to-use input area for entering letters

### 4.4 Feedback System
- Real-time feedback on user inputs
- Comprehensive end-of-round summary
- Invalid word messages include the name of the current lexicon

### 4.5 Hint System
- Optional hints to assist players when stuck

### 4.6 Progress Tracking
- Display of correct answers and remaining possibilities
- Most recent answers displayed at the top of the list

### 4.7 Dictionary Integration
- Valid and missed answer words are hyperlinked to an online Scrabble dictionary
- Dictionary links open in a new browser tab/window

### 4.8 Settings and Customization
- Option to clear cached data
- Potential for future customization options

### 4.9 Retry Functionality
- Option to retry the current word set after viewing all answers
- Allows users to practice with challenging word sets

## 5. User Flow and Gameplay

### 5.1 Starting a Game
1. User opens the Tinware app
2. App loads, displaying the title and a topic selection menu
3. User selects a topic or "All Words"
4. Game initializes with the first word stem

### 5.2 Main Gameplay Loop
1. User is presented with a word stem and prompt (e.g., "Which letters go before/after the following word stem?")
2. User enters a letter in the input area
3. System processes the input:
   - If valid: Displays the word with its definition at the top of the list
   - If invalid: Shows an error message at the top of the list
4. User continues entering letters or chooses to end the round

### 5.3 Ending a Round
1. User clicks "No More Words" or the system detects no more valid words
2. System reveals any remaining valid words at the top of the list
3. Display success message with performance summary
4. "Next Word" and "Retry" buttons become available

### 5.4 Transitioning to Next Word
1. User clicks "Next Word" or presses the space bar
2. Brief transition period
3. New word stem is displayed, and the gameplay loop restarts

### 5.5 Retrying Current Word
1. User clicks "Retry"
2. Brief transition period
3. Same word stem is reset and displayed, and the gameplay loop restarts with the current word set

## 6. Feedback and Messaging

### 6.1 Error Messages
- Display when user enters an invalid letter or word
- Clear, concise language explaining why the input was invalid
- Include the name of the current lexicon (e.g., "Not a valid word in NWL23")

### 6.2 Success Messages
- Show after each valid word entry
- Provide positive reinforcement and encourage continued play

### 6.3 End-of-Round Summary
- Display the number of words correctly identified
- Show any missed words
- Provide encouraging message based on performance

### 6.4 Hints
- Available on user request
- Provide subtle clues without giving away answers

## 7. Visual Design

### 7.1 Color Coding
- Valid answers: Light green background, dark green text
- Invalid answers: Light gray background, dark gray text, strikethrough
- Missed answers: Light red background, dark red text

### 7.2 Typography
- Use bold, fixed-width, serif (typewriter-style) font for word stems and answers
- Ensure readability across devices

### 7.3 Hyperlinks
- Hyperlinked text appears visually identical to non-linked text
- Cursor changes to indicate clickable text

### 7.4 "Can Add S" Display
- Use the same styling as answer words (bold, uppercase, fixed-width)
- Smaller font size than answer words
- Color-coded based on answer status

## 8. Technical Requirements

### 8.1 Data Management
- Efficiently load and cache word data from CSV files
- Use IndexedDB for local storage of word data

### 8.2 Performance
- Ensure smooth transitions between words and rounds
- Optimize for quick response times, even with large word datasets

### 8.3 Compatibility
- Responsive design for various screen sizes (desktop, tablet, mobile)
- Cross-browser compatibility

### 8.4 Dictionary Integration
- Integrate with Merriam-Webster's Scrabble dictionary for word lookups
- Open dictionary links in new browser tabs/windows

## 9. Future Enhancements

- Multiple game types beyond "AddOne"
- User accounts and progress tracking
- Leaderboards and social features
- Customizable difficulty levels
- Integration with educational curricula
- Expanded retry functionality, such as retry counters or performance tracking across retries

## 10. Success Metrics

- User engagement (time spent playing, number of rounds completed, number of retries)
- Learning outcomes (improvement in word recognition and vocabulary over time)
- User retention and return rate
- User satisfaction (ratings, reviews)
- Frequency of dictionary lookups
- Retry usage and its impact on user performance

This PRD outlines the core features and user experience of Tinware, focusing on creating an engaging and educational word game. The document provides a clear vision for the product while allowing room for future enhancements and iterations based on user feedback and educational needs, including the new retry functionality.