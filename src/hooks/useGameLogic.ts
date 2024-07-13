// Generated on 2024-07-13 at 10:45 AM EDT

import { useState, useEffect } from 'react';
import { WordItem } from '../db';
import { GameState, ErrorMessage, SuccessMessage, HintMessage } from '../types/gameTypes';
import { processAnswer, processRemainingAnswers, calculateSuccessMessage, formatAnswer, FormattedAnswer } from '../utils/answerProcessor';

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
  });

  useEffect(() => {
    selectNewWord();
  }, [data]);

  const selectNewWord = () => {
    if (data.length === 0) {
      setGameState(prev => ({
        ...prev,
        answerSet: [],
        errorMessage: { text: "No data available for the selected topic and gametype." },
      }));
      return;
    }

    const uniqueCombinations = Array.from(
      new Set(data.map(item => `${item.subtopic}-${item.root}`))
    );

    if (uniqueCombinations.length === 0) {
      setGameState(prev => ({
        ...prev,
        errorMessage: { text: "No valid combinations found for the selected topic and gametype." },
      }));
      return;
    }

    const randomCombination = uniqueCombinations[Math.floor(Math.random() * uniqueCombinations.length)];
    const [selectedSubtopic, selectedRoot] = randomCombination.split('-');

    const newAnswerSet = data.filter(
      item => item.subtopic === selectedSubtopic && item.root === selectedRoot
    ).map(formatAnswer);

    if (newAnswerSet.length === 0) {
      setGameState(prev => ({
        ...prev,
        errorMessage: { text: "No valid answers found for the selected combination." },
      }));
      return;
    }

    const longestHint = newAnswerSet.reduce((longest, current) => 
      current.hint && current.hint.length > longest.length ? current.hint : longest
    , '');
    
    const validAnswersCount = newAnswerSet.filter(item => 
      item.definition && 
      item.definition !== 'Not a valid word in this lexicon' &&
      item.answer !== '-'
    ).length;
    const defaultHint = `There are ${validAnswersCount} possibilities.`;

    setGameState({
      answerSet: newAnswerSet,
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
          displayedAnswers: [newAnswer, ...prev.displayedAnswers], // Add new answer to the beginning of the array
        };
      }

      return prev;
    });
  };

  const handleNoMoreWords = () => {
    setGameState(prev => {
      const remainingAnswers = processRemainingAnswers(prev.answerSet, prev.displayedAnswers);
      const newDisplayedAnswers = [...remainingAnswers, ...prev.displayedAnswers]; // Add remaining answers to the beginning
      const successMessage = calculateSuccessMessage(prev.answerSet, newDisplayedAnswers);

      return {
        ...prev,
        showAllAnswers: true,
        displayedAnswers: newDisplayedAnswers,
        successMessage,
        skipButtonLabel: 'Next Word',
      };
    });
  };

  const handleNextWord = () => {
    setGameState(prev => ({ ...prev, isTransitioning: true, shouldFocusInput: true }));
    selectNewWord();
    onSkipWord();
    setTimeout(() => setGameState(prev => ({ ...prev, isTransitioning: false })), 300);
  };

  const handleShowHint = () => {
    setGameState(prev => ({ 
      ...prev, 
      showHint: true,
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
    handleShowHint,
    resetShouldFocusInput,
  };
};