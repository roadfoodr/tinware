// Generated on 2024-07-10 at 16:25 PM EDT

import React from 'react';
import { WordItem } from '../db';

interface GamePromptProps {
  selectedTopic: string;
  gametype: string;
  answerSet: WordItem[];
}

const GamePrompt: React.FC<GamePromptProps> = ({ selectedTopic, gametype, answerSet }) => {
  if (answerSet.length === 0) return null;

  return (
    <>
      <h2>Challenge: {selectedTopic}</h2>
      {gametype === "AddOne" && (
        <p>Which letters go <strong>{answerSet[0].subtopic}</strong> the following word stem?</p>
      )}
    </>
  );
};

export default GamePrompt;