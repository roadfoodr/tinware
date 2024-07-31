// Generated on 2024-07-31 at 20:15 PM EDT

import React, { forwardRef } from 'react';
import { FormattedAnswer, GameType } from '../../types/gameTypes';
import { CONFIG } from '../../config/config';

interface InputAreaProps {
  answerSet: FormattedAnswer[];
  userInput: string;
  showAllAnswers: boolean;
  onInputChange: (input: string) => void;
  onKeyPress: (key: string) => void;
  onSubmit: () => void;
  gameType: GameType;
}

const InputArea = forwardRef<HTMLInputElement, InputAreaProps>(
  ({ answerSet, userInput, showAllAnswers, onInputChange, onKeyPress, onSubmit, gameType }, ref) => {
    if (answerSet.length === 0 || showAllAnswers) return null;

    const currentScenario = answerSet[0];
    const { subtopic, root } = currentScenario;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newInput = e.target.value.toUpperCase();
      onInputChange(newInput);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (gameType === 'BingoStem' && userInput.length === CONFIG.GAME.BINGO_STEM_INPUT_LENGTH) {
          onSubmit();
        }
      } else {
        onKeyPress(e.key);
      }
    };

    const isSubmitDisabled = gameType === 'BingoStem' && userInput.length !== CONFIG.GAME.BINGO_STEM_INPUT_LENGTH;

    return (
      <div className="input-area">
        {gameType === 'AddOne' && (
          <>
            {subtopic === 'before' && (
              <input
                type="text"
                ref={ref}
                value={userInput}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                maxLength={1}
                className="pure-input-1-6 root"
                aria-label="Enter letter before the root"
              />
            )}
            <span className="root">{root.toUpperCase()}</span>
            {subtopic === 'after' && (
              <input
                type="text"
                ref={ref}
                value={userInput}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                maxLength={1}
                className="pure-input-1-6 root"
                aria-label="Enter letter after the root"
              />
            )}
          </>
        )}
        {gameType === 'BingoStem' && (
          <div className="bingo-stem-input">
            <input
              type="text"
              ref={ref}
              value={userInput}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              maxLength={CONFIG.GAME.BINGO_STEM_INPUT_LENGTH}
              className="pure-input-1-3 root bingo-input"
              aria-label="Enter seven letters for BingoStem"
            />
            <button 
              onClick={onSubmit} 
              className={`pure-button ${isSubmitDisabled ? 'pure-button-disabled' : ''}`}
              disabled={isSubmitDisabled}
            >
              Submit
            </button>
          </div>
        )}
      </div>
    );
  }
);

InputArea.displayName = 'InputArea';

export default InputArea;