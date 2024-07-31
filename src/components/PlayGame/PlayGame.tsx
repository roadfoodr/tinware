// Generated on 2024-07-31 at 20:00 PM EDT

import React, { useEffect, useRef } from 'react';
import { useGameLogic } from '../../hooks/useGameLogic';
import GamePrompt from './GamePrompt';
import InputArea from './InputArea';
import ControlButtons from './ControlButtons';
import DisplayArea from './DisplayArea';
import MessageArea from './MessageArea';
import { PlayGameProps, GameType } from '../../types/gameTypes';

const PlayGame: React.FC<PlayGameProps> = ({ data, gametype, onSkipWord, selectedTopic }) => {
  const {
    gameState,
    handleInputChange,
    handleKeyPress,
    handleSubmit,
    handleNoMoreWords,
    handleNextWord,
    handleRetry,
    handleShowHint,
    resetShouldFocusInput,
  } = useGameLogic(data, onSkipWord, gametype);

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
    gameType,
  } = gameState;

  useEffect(() => {
    if (shouldFocusInput && inputRef.current) {
      inputRef.current.focus();
      resetShouldFocusInput();
    }
  }, [shouldFocusInput, resetShouldFocusInput]);

  useEffect(() => {
    const handleGlobalKeyPress = (event: KeyboardEvent) => {
      if (event.key === ' ' && !isTransitioning) {
        event.preventDefault();
        if (showAllAnswers) {
          handleNextWord();
        } else {
          handleNoMoreWords();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyPress);

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyPress);
    };
  }, [showAllAnswers, isTransitioning, handleNextWord, handleNoMoreWords]);

  if (answerSet.length === 0) {
    return <div>Loading...</div>;
  }

  const currentScenario = answerSet[0];
  const { subtopic, root } = currentScenario;

  return (
    <div className="pure-g">
      <div className="pure-u-1">
        <GamePrompt
          selectedTopic={selectedTopic}
          gametype={gameType}
          subtopic={subtopic}
          root={root}
        />
        <InputArea
          ref={inputRef}
          answerSet={answerSet}
          userInput={userInput}
          showAllAnswers={showAllAnswers}
          onInputChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onSubmit={handleSubmit}
          gameType={gameType}
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