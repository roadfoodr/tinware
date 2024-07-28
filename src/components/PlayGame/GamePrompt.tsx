// Generated on 2024-07-29 at 11:00 AM EDT

import React from 'react';

interface GamePromptProps {
  selectedTopic: string;
  gametype: string;
  subtopic: string;
}

const GamePrompt: React.FC<GamePromptProps> = ({ selectedTopic, gametype, subtopic }) => {
  return (
    <div className="game-prompt">
      <h2>Challenge: {selectedTopic}</h2>
      {gametype === "AddOne" && (
        <p>
          Which letters go <strong>{subtopic}</strong> the word stem?
        </p>
      )}
    </div>
  );
};

export default GamePrompt;