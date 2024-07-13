// Generated on 2024-07-14 at 14:45 PM EDT

import React from 'react';

interface ControlButtonsProps {
  skipButtonLabel: string;
  isTransitioning: boolean;
  showAllAnswers: boolean;
  showRetry: boolean;
  showHint: boolean;
  onSkip: () => void;
  onRetry: () => void;
  onShowHint: () => void;
  onNoMoreWords: () => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  skipButtonLabel,
  isTransitioning,
  showAllAnswers,
  showRetry,
  showHint,
  onSkip,
  onRetry,
  onShowHint,
  onNoMoreWords
}) => {
  return (
    <div>
      <button 
        className="pure-button" 
        onClick={onSkip}
        disabled={isTransitioning}
      >
        {skipButtonLabel}
      </button>
      {showRetry && (
        <button
          className="pure-button"
          onClick={onRetry}
          disabled={isTransitioning}
        >
          Retry
        </button>
      )}
      {!showAllAnswers && (
        <>
          <button 
            className="pure-button" 
            onClick={onShowHint}
            disabled={isTransitioning || showHint}
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
      )}
    </div>
  );
};

export default ControlButtons;