// Generated on 2024-07-13 at 16:45 PM EDT

import React from 'react';

interface ControlButtonsProps {
  skipButtonLabel: string;
  isTransitioning: boolean;
  showAllAnswers: boolean;
  showRetry: boolean;
  hint: string;
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
  hint,
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
            className={`pure-button ${!hint ? 'pure-button-disabled' : ''}`} 
            onClick={onShowHint}
            disabled={!hint}
          >
            Show Hint
          </button>
          <button className="pure-button" onClick={onNoMoreWords}>No More Words</button>
        </>
      )}
    </div>
  );
};

export default ControlButtons;