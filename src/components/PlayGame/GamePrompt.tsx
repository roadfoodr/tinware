// Generated on 2024-07-31 at 11:30 AM EDT

import React from 'react';
import { GameType } from '../../types/gameTypes';

interface GamePromptProps {
  selectedTopic: string;
  gametype: GameType;
  subtopic: string;
  root: string;
}

const GamePrompt: React.FC<GamePromptProps> = ({ selectedTopic, gametype, subtopic, root }) => {
  return (
    <div className="game-prompt">
      <h2>Challenge: {selectedTopic}</h2>
      {gametype === "AddOne" && (
        <p>
          Which letters go <strong>{subtopic}</strong> the word stem?
        </p>
      )}
      {gametype === "BingoStem" && (
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