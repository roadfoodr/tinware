import React, { forwardRef } from 'react';
import { useGameContext } from '../context/GameContext';
import InputArea from './PlayGame/InputArea';

const BingoStemGame = forwardRef<HTMLInputElement>((props, ref) => {
  const { gameState } = useGameContext();

  if (gameState.answerSet.length === 0 || gameState.showAllAnswers) return null;

  return (
    <InputArea
      ref={ref}
      gameType="BingoStem"
    />
  );
});

BingoStemGame.displayName = 'BingoStemGame';

export default BingoStemGame;