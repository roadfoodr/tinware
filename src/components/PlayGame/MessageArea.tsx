import React from 'react';
import { useGameContext } from '../../context/GameContext';

const MessageArea: React.FC = () => {
  const { gameState } = useGameContext();
  const { errorMessage, successMessage, hint, showHint } = gameState;

  return (
    <div className="message-area">
      {showHint && hint && (
        <div className="hint-message" dangerouslySetInnerHTML={{ __html: hint.text }} />
      )}
      {errorMessage && (
        <div className="error-message">{errorMessage.text}</div>
      )}
      {successMessage && (
        <div 
          className={`success-message ${successMessage.class}`}
          dangerouslySetInnerHTML={{ __html: successMessage.text }}
        />
      )}
    </div>
  );
};

export default MessageArea;