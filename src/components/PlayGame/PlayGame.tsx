import React, { useEffect } from 'react';
import { useGameContext } from '../../context/GameContext';
import { PlayGameProps } from '../../types/gameTypes';
import GameContainer from '../GameContainer';
import { formatAnswer } from '../../utils/answerProcessor';
import { useCommonGameLogic } from '../../hooks/useCommonGameLogic';

const PlayGame: React.FC<PlayGameProps> = ({ data, gametype, onSkipWord, selectedTopic, onGameTypeChange }) => {
  const { setGameState, setCurrentScenario, setSelectedTopic } = useGameContext();
  const {
    handleNoMoreWords,
    handleNextWord,
    handleRetry,
    handleShowHint,
  } = useCommonGameLogic(onSkipWord);

  useEffect(() => {
    const formattedData = data.map(formatAnswer);
    setCurrentScenario(formattedData);
    setSelectedTopic(selectedTopic);
    setGameState(prev => ({
      ...prev,
      answerSet: formattedData,
      gameType: gametype,
      shouldFocusInput: true,
      userInput: '',
      displayedAnswers: [],
      showAllAnswers: false,
      skipButtonLabel: 'Skip Word',
      errorMessage: null,
      successMessage: null,
      hint: null,
      showHint: false,
      showRetry: false,
      invalidSubmissionCount: 0,
    }));
  }, [data, gametype, selectedTopic, setCurrentScenario, setSelectedTopic, setGameState]);

  return (
    <GameContainer
      onNoMoreWords={handleNoMoreWords}
      onNextWord={handleNextWord}
      onRetry={handleRetry}
      onShowHint={handleShowHint}
    />
  );
};

export default PlayGame;