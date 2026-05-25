import React from 'react';
import { useGameContext } from '../../context/GameContext';
import { getGameType } from '../../gameTypes';

const GamePrompt: React.FC = () => {
  const { gameState, selectedTopic } = useGameContext();

  if (!gameState.answerSet.length || !selectedTopic) return null;

  const gameDef = getGameType(gameState.gameType);
  const scenario = gameState.answerSet[0];

  return <>{gameDef.renderPrompt({ scenario, selectedTopic })}</>;
};

export default GamePrompt;
