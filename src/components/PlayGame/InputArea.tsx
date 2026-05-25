import React, { forwardRef } from 'react';
import { useGameContext } from '../../context/GameContext';
import { useGameInput } from '../../hooks/useGameInput';
import { getGameType } from '../../gameTypes';

const InputArea = forwardRef<HTMLInputElement>((_, ref) => {
  const { gameState } = useGameContext();
  const { handleInputChange, handleKeyPress, handleSubmit } = useGameInput();

  if (gameState.answerSet.length === 0) return null;

  const gameDef = getGameType(gameState.gameType);
  const scenario = gameState.answerSet[0];
  const isInputDisabled = gameState.showAllAnswers;

  // Hide input area after answers are shown for explicit-submit game types
  if (gameDef.inputConfig.requiresExplicitSubmit && gameState.showAllAnswers) return null;

  const isSubmitDisabled = gameDef.inputConfig.requiresExplicitSubmit &&
    (gameState.userInput.length !== gameDef.inputConfig.maxLength || isInputDisabled);

  return (
    <>
      {gameDef.renderInput({
        inputRef: ref,
        value: gameState.userInput,
        onChange: handleInputChange,
        onKeyDown: (e) => handleKeyPress(e.key, e),
        onSubmit: handleSubmit,
        disabled: isInputDisabled,
        isSubmitDisabled,
        scenario,
      })}
    </>
  );
});

InputArea.displayName = 'InputArea';

export default InputArea;
