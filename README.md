# TINWARE

TINWARE is a React-based web application designed to help users practice and improve knowledge of Scrabble word lists through interactive word games.

## How to Play

1. Select a wordlist from the dropdown menu.
2. You'll be presented with a challenge scenario. The goal is to find all possible valid words for each challenge.  There are two types of scenarios depending on the challenge you've chosen:
   - Letter Addition: You'll see a word stem and be asked to add a letter either before or after it.
   - Word Formation: You'll be given a set of letters and asked to form words using all of them.
3. For Letter Addition challenges:
   - Type a single letter to submit your answer.
   - The game will immediately validate your input.
4. For Word Formation challenges:
   - Enter a word using all the given letters.
   - Click the "Submit" button or press Enter to check your answer.
5. Use the "Show Hint" button if you need help with either challenge type.
6. Click "No More Words" when you can't think of any more valid words or your entries are complete.  Words that you missed will be displayed.
7. For best results, don't guess at words.  Just enter the ones you know for sure, then review your performance and any missed words.
9. Optionally, use the "Retry" button to attempt the same challenge again.
10. Click "Next Word" or press the spacebar to move to the next challenge.

## Live Demo

https://tinware.netlify.app/

[![Netlify Status](https://api.netlify.com/api/v1/badges/45b4f791-9b68-4e61-bc91-17e4339d8fe9/deploy-status)](https://app.netlify.com/sites/tinware/deploys)

## Technologies Used

- React
- TypeScript
- Vite
- Dexie.js (for IndexedDB interactions)
- PureCSS (for styling)
- FontAwesome (for icons)

## Code generation

- Approximately 80% (ok, 90%) of code was created by generative AI (Anthropic Claude 3.5 Sonnet)

## Contributing

Contributions are welcome! Please feel free to submit an Issue or Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
