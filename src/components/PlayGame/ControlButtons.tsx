// Generated on 2024-07-10 at 16:35 PM EDT

import React from 'react';

interface ControlButtonsProps {
  skipButtonLabel: string;
  isTransitioning: boolean;
  showAllAnswers: boolean;
  hint: string;
  onSkip: () => void;
  onShowHint: () => void;
  onNoMoreWords: () => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  skipButtonLabel,
  isTransitioning,
  showAllAnswers,
  hint,
  onSkip,
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