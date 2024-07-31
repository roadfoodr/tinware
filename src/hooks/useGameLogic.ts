// Generated on 2024-08-01 at 11:30 AM EDT

import { useState, useEffect, useCallback } from 'react';
import { WordItem } from '../db';
import { GameState, ErrorMessage, SuccessMessage, HintMessage, GameType, FormattedAnswer } from '../types/gameTypes';
import { processAnswer, processRemainingAnswers, calculateSuccessMessage, formatAnswer } from '../utils/answerProcessor';
import { CONFIG } from '../config/config';

export const useGameLogic = (data: WordItem[], onSkipWord: () => void, gameType: GameType) => {
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
    gameType: gameType,
  });

  const selectNewScenario = useCallback(() => {
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
  }, [data]);

  useEffect(() => {
    selectNewScenario();
  }, [selectNewScenario]);

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
      gameType: gameType,
    });
  };

  const handleInputChange = (input: string) => {
    setGameState(prev => {
      if (prev.gameType === 'AddOne') {
        return processAddOneInput(prev, input);
      } else {
        // For BingoStem, only allow alphabetical characters
        const filteredInput = input.replace(/[^A-Za-z]/g, '').toUpperCase();
        return {
          ...prev,
          userInput: filteredInput,
          errorMessage: null,
          successMessage: null,
          showHint: false,
        };
      }
    });
  };

  const handleKeyPress = (key: string) => {
    // We no longer handle the space bar here
    if (gameState.gameType === 'BingoStem' && key === 'Enter' && gameState.userInput.length === CONFIG.GAME.BINGO_STEM_INPUT_LENGTH) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setGameState(prev => {
      if (prev.gameType === 'BingoStem') {
        return processBingoStemInput(prev);
      }
      return prev;
    });
  };

  const processAddOneInput = (prevState: GameState, input: string): GameState => {
    if (!/^[A-Z]$/.test(input)) {
      return prevState;
    }

    const { newAnswer, isValid, isRepeated } = processAnswer(input, prevState.answerSet, prevState.displayedAnswers);
    
    if (isRepeated) {
      return prevState;
    }

    if (newAnswer) {
      return {
        ...prevState,
        userInput: '',
        displayedAnswers: [newAnswer, ...prevState.displayedAnswers],
        errorMessage: null,
        successMessage: null,
        showHint: false,
      };
    }

    return {
      ...prevState,
      userInput: '',
      errorMessage: { text: `Not a valid word: ${input}${prevState.answerSet[0].root}` },
      successMessage: null,
      showHint: false,
    };
  };

  const processBingoStemInput = (prevState: GameState): GameState => {
    const { newAnswer, isValid, isRepeated, message } = processAnswer(prevState.userInput, prevState.answerSet, prevState.displayedAnswers, true);
    
    if (isRepeated) {
      return {
        ...prevState,
        userInput: '',  // Clear input even if the word is repeated
      };
    }

    if (newAnswer) {
      return {
        ...prevState,
        userInput: '',
        displayedAnswers: [newAnswer, ...prevState.displayedAnswers],
        errorMessage: null,
        successMessage: null,
        showHint: false,
      };
    }

    return {
      ...prevState,
      userInput: '',
      errorMessage: message?.text.includes('Answer must include only the letters') ? null : message as ErrorMessage,
      hint: message?.text.includes('Answer must include only the letters') ? message as HintMessage : null,
      showHint: message?.text.includes('Answer must include only the letters'),
      successMessage: null,
    };
  };

  const handleNoMoreWords = () => {
    setGameState(prev => {
      if (prev.showAllAnswers) {
        return prev; // Do nothing if all answers are already shown
      }
      const remainingAnswers = processRemainingAnswers(prev.answerSet, prev.displayedAnswers);
      const newDisplayedAnswers = [...remainingAnswers, ...prev.displayedAnswers];
      const successMessage = calculateSuccessMessage(prev.answerSet, newDisplayedAnswers, gameType);

      return {
        ...prev,
        showAllAnswers: true,
        displayedAnswers: newDisplayedAnswers,
        successMessage,
        skipButtonLabel: 'Next Word',
        showRetry: true,
        showHint: false,
        userInput: '',  // Clear input when showing all answers
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
    setGameState(prev => ({
      ...prev,
      isTransitioning: true,
      shouldFocusInput: true,
    }));
    
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
    handleKeyPress,
    handleSubmit,
    handleNoMoreWords,
    handleNextWord,
    handleRetry,
    handleShowHint,
    resetShouldFocusInput,
  };
};
