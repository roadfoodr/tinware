// Generated on 2024-07-14 at 20:15 PM EDT

import React, { useEffect, useRef } from 'react';
import { useGameLogic } from '../../hooks/useGameLogic';
import GamePrompt from './GamePrompt';
import InputArea from './InputArea';
import ControlButtons from './ControlButtons';
import DisplayArea from './DisplayArea';
import MessageArea from './MessageArea';
import { PlayGameProps } from '../../types/gameTypes';

const PlayGame: React.FC<PlayGameProps> = ({ data, gametype, onSkipWord, selectedTopic }) => {
  const {
    gameState,
    handleInputChange,
    handleNoMoreWords,
    handleNextWord,
    handleRetry,
    handleShowHint,
    resetShouldFocusInput,
  } = useGameLogic(data, onSkipWord);

  const inputRef = useRef<HTMLInputElement>(null);

  const {
    answerSet,
    userInput,
    displayedAnswers,
    showAllAnswers,
    skipButtonLabel,
    errorMessage,
    successMessage,
    isTransitioning,
    hint,
    showHint,
    shouldFocusInput,
    showRetry,
  } = gameState;

  useEffect(() => {
    if (shouldFocusInput && inputRef.current) {
      inputRef.current.focus();
      resetShouldFocusInput();
    }
  }, [shouldFocusInput, resetShouldFocusInput]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === ' ' && skipButtonLabel === 'Next Word' && !isTransitioning) {
        event.preventDefault();
        handleNextWord();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [skipButtonLabel, isTransitioning, handleNextWord]);

  if (answerSet.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pure-g">
      <div className="pure-u-1">
        <GamePrompt
          selectedTopic={selectedTopic}
          gametype={gametype}
          answerSet={answerSet}
        />
        <InputArea
          ref={inputRef}
          answerSet={answerSet}
          userInput={userInput}
          showAllAnswers={showAllAnswers}
          onInputChange={handleInputChange}
        />
        <ControlButtons
          skipButtonLabel={skipButtonLabel}
          isTransitioning={isTransitioning}
          showAllAnswers={showAllAnswers}
          showRetry={showRetry}
          showHint={showHint}
          onSkip={handleNextWord}
          onRetry={handleRetry}
          onShowHint={handleShowHint}
          onNoMoreWords={handleNoMoreWords}
        />
        <MessageArea
          errorMessage={errorMessage}
          successMessage={successMessage}
          hint={hint}
          showHint={showHint}
        />
        <DisplayArea
          displayedAnswers={displayedAnswers}
          showAllAnswers={showAllAnswers}
        />
      </div>
    </div>
  );
};

export default PlayGame;