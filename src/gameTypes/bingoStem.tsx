import { GameTypeDefinition, GameInputRenderProps, GamePromptRenderProps } from './types';
import { CONFIG } from '../config/config';

/**
 * Check that the input uses exactly the allowed letters (root + subtopic).
 */
const isValidLetterCombination = (input: string, root: string, subtopic: string): boolean => {
  const allowedLetters = (root + subtopic).toUpperCase();
  const inputLetters = input.toUpperCase();

  if (inputLetters.length !== allowedLetters.length) return false;

  const allowedLetterCount = new Map<string, number>();
  const inputLetterCount = new Map<string, number>();

  for (const letter of allowedLetters) {
    allowedLetterCount.set(letter, (allowedLetterCount.get(letter) || 0) + 1);
  }

  for (const letter of inputLetters) {
    inputLetterCount.set(letter, (inputLetterCount.get(letter) || 0) + 1);
  }

  if (allowedLetterCount.size !== inputLetterCount.size) return false;

  for (const [letter, count] of allowedLetterCount) {
    if (inputLetterCount.get(letter) !== count) return false;
  }

  return true;
};

const renderPrompt = ({ scenario, selectedTopic }: GamePromptRenderProps) => (
  <div className="game-prompt">
    <h2>Challenge: {selectedTopic}</h2>
    <p>Enter seven letters to form bingos with the given rack:</p>
    <p className="bingo-stem-rack">
      <span className="root">{scenario.root.toUpperCase()}</span> +{' '}
      <span className="root">{scenario.subtopic.toUpperCase()}</span>
    </p>
  </div>
);

const renderInput = ({
  inputRef,
  value,
  onChange,
  onKeyDown,
  onSubmit,
  disabled,
  isSubmitDisabled,
}: GameInputRenderProps) => (
  <div className="input-area">
    <div className="bingo-stem-input">
      <input
        type="text"
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        maxLength={CONFIG.GAME.BINGO_STEM_INPUT_LENGTH}
        className="pure-input-1-3 root bingo-input"
        aria-label="Enter seven letters for BingoStem"
        disabled={disabled}
      />
      <button
        onClick={onSubmit}
        className={`pure-button ${isSubmitDisabled ? 'pure-button-disabled' : ''}`}
        disabled={isSubmitDisabled}
      >
        Submit
      </button>
    </div>
  </div>
);

export const bingoStemDefinition: GameTypeDefinition = {
  key: 'BingoStem',

  inputConfig: {
    maxLength: CONFIG.GAME.BINGO_STEM_INPUT_LENGTH,
    requiresExplicitSubmit: true,
  },

  filterInput: (input: string) => input.replace(/[^A-Za-z]/g, '').toUpperCase(),

  shouldAutoSubmit: () => false,

  renderPrompt,

  renderInput,

  validateInput: (input, scenario) => {
    if (!isValidLetterCombination(input, scenario.root, scenario.subtopic)) {
      return {
        valid: false,
        message: `Entry must include only the letters <span class="root">${scenario.root.toUpperCase()}</span> + <span class="root">${scenario.subtopic.toUpperCase()}</span>.`,
      };
    }
    return null; // passes validation
  },

  matchAnswer: (input, answer) => answer.answerWord.toUpperCase() === input.toUpperCase(),

  buildAnswerWord: (input) => input.toUpperCase(),
};
