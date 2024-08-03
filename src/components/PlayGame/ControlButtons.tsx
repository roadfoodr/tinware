import React, { useEffect, useRef } from 'react';
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
  const noMoreWordsRef = useRef<HTMLButtonElement>(null);
  const nextWordRef = useRef<HTMLButtonElement>(null);

  const {
    skipButtonLabel,
    isTransitioning,
    showAllAnswers,
    showRetry,
    showHint,
  } = gameState;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.key === ' ') {
        event.preventDefault();
        if (!showAllAnswers && noMoreWordsRef.current) {
          noMoreWordsRef.current.click();
        } else if (showAllAnswers && nextWordRef.current) {
          nextWordRef.current.click();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showAllAnswers]);

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
            disabled={isTransitioning || showHint}
          >
            Show Hint
          </button>
          <button 
            ref={noMoreWordsRef}
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
            ref={nextWordRef}
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