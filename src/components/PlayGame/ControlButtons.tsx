import React from 'react';
import { useGameContext } from '../../context/GameContext';

interface ControlButtonsProps {
  onNoMoreWords: () => void;
  onSkip: () => void;
  onRetry: () => void;
  onShowHint: () => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  onNoMoreWords,
  onSkip,
  onRetry,
  onShowHint
}) => {
  const { gameState } = useGameContext();

  const {
    skipButtonLabel,
    isTransitioning,
    showAllAnswers,
    showRetry,
  } = gameState;

  return (
    <div className="control-buttons">
      {!showAllAnswers ? (
        <>
          <button 
            className="pure-button" 
            onClick={onSkip}
            disabled={isTransitioning}
          >
            {skipButtonLabel}
          </button>
          <button 
            className="pure-button" 
            onClick={onShowHint}
            disabled={isTransitioning}
          >
            Show Hint
          </button>
          <button 
            className="pure-button" 
            onClick={onNoMoreWords}
            disabled={isTransitioning}
          >
            No More Words
          </button>
        </>
      ) : (
        <>
          {showRetry && (
            <button
              className="pure-button"
              onClick={onRetry}
              disabled={isTransitioning}
            >
              Retry
            </button>
          )}
          <button 
            className="pure-button" 
            onClick={onSkip}
            disabled={isTransitioning}
          >
            {skipButtonLabel}
          </button>
        </>
      )}
    </div>
  );
};

export default ControlButtons;