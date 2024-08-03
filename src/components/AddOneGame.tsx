import React, { forwardRef } from 'react';
import { useGameContext } from '../context/GameContext';
import InputArea from './PlayGame/InputArea';

const AddOneGame = forwardRef<HTMLInputElement>((props, ref) => {
  const { gameState } = useGameContext();

  if (gameState.answerSet.length === 0) return null;

  return (
    <InputArea
      ref={ref}
      gameType="AddOne"
    />
  );
});

AddOneGame.displayName = 'AddOneGame';

export default AddOneGame;