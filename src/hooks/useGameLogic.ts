// Generated on 2024-07-29 at 01:30 AM EDT

import { useState, useEffect } from 'react';
import { WordItem } from '../db';
import { GameState, ErrorMessage, SuccessMessage, HintMessage } from '../types/gameTypes';
import { processAnswer, processRemainingAnswers, calculateSuccessMessage, formatAnswer, FormattedAnswer } from '../utils/answerProcessor';
import { CONFIG } from '../config/config';

export const useGameLogic = (data: WordItem[], onSkipWord: () => void) => {
  const [gameState, setGameState] = useState<GameState>({
    answerSet: [],
    userInput: '',
    displayedAnswers: [],
    showAllAnswers: false,
    skipButtonLabel: 'Skip Word',
    errorMessage: null,
    successMessage: null,
    hint: null,
    showHint: false,
    isTransitioning: false,
    shouldFocusInput: false,
    showRetry: false,
  });

  useEffect(() => {
    selectNewScenario();
  }, [data]);

  const selectNewScenario = () => {
    if (data.length === 0) {
      setGameState(prev => ({
        ...prev,
        answerSet: [],
        errorMessage: { text: "No data available for the selected topic and gametype." },
      }));
      return;
    }

    const uniqueScenarios = Array.from(new Set(data.map(item => item.scenarioID)));

    if (uniqueScenarios.length === 0) {
      setGameState(prev => ({
        ...prev,
        errorMessage: { text: "No valid scenarios found for the selected topic and gametype." },
      }));
      return;
    }

    const randomScenarioID = uniqueScenarios[Math.floor(Math.random() * uniqueScenarios.length)];
    const newAnswerSet = data
      .filter(item => item.scenarioID === randomScenarioID)
      .map(formatAnswer);

    setNewGameState(newAnswerSet);
  };

  const setNewGameState = (answerSet: FormattedAnswer[]) => {
    if (answerSet.length === 0) {
      setGameState(prev => ({
        ...prev,
        errorMessage: { text: "No valid answers found for the selected scenario." },
      }));
      return;
    }

    const longestHint = answerSet.reduce((longest, current) => 
      current.hint && current.hint.length > longest.length ? current.hint : longest
    , '');
    
    const validAnswersCount = answerSet.filter(item => 
      item.definition && 
      item.definition !== 'Not a valid word in this lexicon' &&
      item.answer !== '-'
    ).length;
    const defaultHint = `There are ${validAnswersCount} possibilities.`;

    setGameState({
      answerSet: answerSet,
      userInput: '',
      displayedAnswers: [],
      showAllAnswers: false,
      skipButtonLabel: 'Skip Word',
      errorMessage: null,
      successMessage: null,
      isTransitioning: false,
      hint: longestHint ? { text: longestHint } : { text: defaultHint },
      showHint: false,
      shouldFocusInput: true,
      showRetry: false,
    });
  };

  const handleInputChange = (input: string) => {
    if (input === ' ') {
      handleNoMoreWords();
      return;
    }

    if (!/^[A-Z]$/.test(input)) {
      return;
    }

    setGameState(prev => {
      const { newAnswer, isValid, isRepeated } = processAnswer(input, prev.answerSet, prev.displayedAnswers);
      
      if (isRepeated) {
        // Ignore repeated guesses
        return prev;
      }

      if (newAnswer) {
        return {
          ...prev,
          userInput: '',
          displayedAnswers: [newAnswer, ...prev.displayedAnswers],
          errorMessage: null,
          successMessage: null,
          showHint: false,
        };
      }

      return {
        ...prev,
        errorMessage: { text: `Not a valid word: ${input}${prev.answerSet[0].root}` },
        successMessage: null,
        showHint: false,
      };
    });
  };

  const handleNoMoreWords = () => {
    setGameState(prev => {
      const remainingAnswers = processRemainingAnswers(prev.answerSet, prev.displayedAnswers);
      const newDisplayedAnswers = [...remainingAnswers, ...prev.displayedAnswers];
      const successMessage = calculateSuccessMessage(prev.answerSet, newDisplayedAnswers);

      return {
        ...prev,
        showAllAnswers: true,
        displayedAnswers: newDisplayedAnswers,
        successMessage,
        skipButtonLabel: 'Next Word',
        showRetry: true,
        showHint: false,
      };
    });
  };

  const handleNextWord = () => {
    setGameState(prev => ({ ...prev, isTransitioning: true, shouldFocusInput: true }));
    selectNewScenario();
    onSkipWord();
    setTimeout(() => setGameState(prev => ({ ...prev, isTransitioning: false })), CONFIG.GAME.TRANSITION_DELAY_MS);
  };

  const handleRetry = () => {
    setGameState(prev => {
      const retryAnswerSet = [...prev.answerSet];
      return {
        ...prev,
        isTransitioning: true,
        shouldFocusInput: true,
      };
    });
    
    setTimeout(() => {
      setNewGameState(gameState.answerSet);
      setGameState(prev => ({ ...prev, isTransitioning: false }));
    }, CONFIG.GAME.TRANSITION_DELAY_MS);
  };

  const handleShowHint = () => {
    setGameState(prev => ({ 
      ...prev, 
      showHint: true,
      errorMessage: null,
      successMessage: null,
      shouldFocusInput: true
    }));
  };

  const resetShouldFocusInput = () => {
    setGameState(prev => ({ ...prev, shouldFocusInput: false }));
  };

  return {
    gameState,
    handleInputChange,
    handleNoMoreWords,
    handleNextWord,
    handleRetry,
    handleShowHint,
    resetShouldFocusInput,
  };
};