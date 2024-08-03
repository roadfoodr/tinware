import React from 'react';
import { useGameContext } from '../../context/GameContext';

const GamePrompt: React.FC = () => {
  const { gameState, selectedTopic } = useGameContext();

  if (!gameState.answerSet.length) return null;

  const { gameType } = gameState;
  const { subtopic, root } = gameState.answerSet[0];

  return (
    <div className="game-prompt">
      <h2>Challenge: {selectedTopic}</h2>
      {gameType === "AddOne" && (
        <p>
          Which letters go <strong>{subtopic}</strong> the word stem?
        </p>
      )}
      {gameType === "BingoStem" && (
        <>
          <p>
            Enter seven letters to form bingos with the given rack:
          </p>
          <p className="bingo-stem-rack">
            <span className="root">{root.toUpperCase()}</span> + <span className="root">{subtopic.toUpperCase()}</span>
          </p>
        </>
      )}
    </div>
  );
};

export default GamePrompt;