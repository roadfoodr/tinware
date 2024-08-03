import React, { forwardRef } from 'react';
import { useGameContext } from '../../context/GameContext';
import { useGameInput } from '../../hooks/useGameInput';
import { CONFIG } from '../../config/config';
import { GameType } from '../../types/gameTypes';

interface InputAreaProps {
  gameType: GameType;
}

const InputArea = forwardRef<HTMLInputElement, InputAreaProps>((props, ref) => {
  const { gameState } = useGameContext();
  const { handleInputChange, handleKeyPress, handleSubmit } = useGameInput();

  if (gameState.answerSet.length === 0) return null;
  if (props.gameType === 'BingoStem' && gameState.showAllAnswers) return null;

  const currentScenario = gameState.answerSet[0];
  const { subtopic, root } = currentScenario;

  const isInputDisabled = gameState.showAllAnswers;
  const isSubmitDisabled = props.gameType === 'BingoStem' && 
    (gameState.userInput.length !== CONFIG.GAME.BINGO_STEM_INPUT_LENGTH || isInputDisabled);

  const renderAddOneInput = () => (
    <input
      type="text"
      ref={ref}
      value={gameState.userInput}
      onChange={(e) => handleInputChange(e.target.value)}
      onKeyDown={(e) => handleKeyPress(e.key, e)}
      maxLength={1}
      className="pure-input-1-6 root"
      aria-label={`Enter letter ${subtopic} the root`}
      disabled={isInputDisabled}
    />
  );

  return (
    <div className="input-area">
      {props.gameType === 'AddOne' && (
        <>
          {subtopic === 'before' && renderAddOneInput()}
          <span className="root">{root.toUpperCase()}</span>
          {subtopic === 'after' && renderAddOneInput()}
        </>
      )}
      {props.gameType === 'BingoStem' && (
        <div className="bingo-stem-input">
          <input
            type="text"
            ref={ref}
            value={gameState.userInput}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e.key, e)}
            maxLength={CONFIG.GAME.BINGO_STEM_INPUT_LENGTH}
            className="pure-input-1-3 root bingo-input"
            aria-label="Enter seven letters for BingoStem"
            disabled={isInputDisabled}
          />
          <button 
            onClick={handleSubmit} 
            className={`pure-button ${isSubmitDisabled ? 'pure-button-disabled' : ''}`}
            disabled={isSubmitDisabled}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
});

InputArea.displayName = 'InputArea';

export default InputArea;