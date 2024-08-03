import { useCallback, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { FormattedAnswer, GameType } from '../types/gameTypes';
import { processRemainingAnswers, calculateSuccessMessage } from '../utils/GameUtils';
import { CONFIG } from '../config/config';

export const useCommonGameLogic = (onSkipWord: () => void) => {
  const { gameState, setGameState, currentScenario, setCurrentScenario } = useGameContext();

  const handleNoMoreWords = useCallback(() => {
    if (!currentScenario) return;

    setGameState(prev => {
      if (prev.showAllAnswers) return prev;

      const remainingAnswers = processRemainingAnswers(currentScenario, prev.displayedAnswers);
      const newDisplayedAnswers = [...remainingAnswers, ...prev.displayedAnswers];
      const successMessage = calculateSuccessMessage(currentScenario, newDisplayedAnswers, prev.gameType);

      return {
        ...prev,
        showAllAnswers: true,
        displayedAnswers: newDisplayedAnswers,
        successMessage,
        skipButtonLabel: 'Next Word',
        showRetry: true,
        showHint: false,
        userInput: '',
      };
    });
  }, [currentScenario, setGameState]);

  const handleNextWord = useCallback(() => {
    setGameState(prev => ({ 
      ...prev, 
      isTransitioning: true, 
      shouldFocusInput: true 
    }));
    onSkipWord();
    setTimeout(() => {
      setGameState(prev => ({ 
        ...prev, 
        isTransitioning: false,
        shouldFocusInput: true 
      }));
    }, CONFIG.GAME.TRANSITION_DELAY_MS);
  }, [setGameState, onSkipWord]);

  const handleRetry = useCallback(() => {
    if (!currentScenario) return;

    setGameState(prev => ({
      ...prev,
      isTransitioning: true,
      shouldFocusInput: true,
      answerSet: currentScenario,
      userInput: '',
      displayedAnswers: [],
      showAllAnswers: false,
      skipButtonLabel: 'Skip Word',
      errorMessage: null,
      successMessage: null,
      hint: null,
      showHint: false,
      showRetry: false,
    }));
    
    setTimeout(() => {
      setGameState(prev => ({ 
        ...prev, 
        isTransitioning: false,
        shouldFocusInput: true 
      }));
    }, CONFIG.GAME.TRANSITION_DELAY_MS);
  }, [currentScenario, setGameState]);

  const handleShowHint = useCallback(() => {
    if (!currentScenario) return;

    const validAnswers = currentScenario.filter(item => 
      item.answer !== '-' && 
      item.definition && 
      item.definition !== 'Not a valid word in this lexicon'
    );

    const identifiedValidAnswers = gameState.displayedAnswers.filter(item => 
      item.definition && 
      item.definition !== 'Not a valid word in this lexicon' && 
      item.answer !== '-' &&
      !item.isRemaining &&
      validAnswers.some(validItem => validItem.answerWord === item.answerWord)
    );

    let hintMessage: string;

    if (validAnswers.length === 0 && identifiedValidAnswers.length === 0) {
      hintMessage = "There are no possible valid words";
    } else {
      hintMessage = `You have identified ${identifiedValidAnswers.length} out of ${validAnswers.length} possible valid words`;
    }

    setGameState(prev => ({ 
      ...prev, 
      showHint: true,
      hint: { text: hintMessage },
      errorMessage: null,
      successMessage: null,
      shouldFocusInput: true
    }));
  }, [currentScenario, gameState.displayedAnswers, setGameState]);

  useEffect(() => {
    if (gameState.shouldFocusInput) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, shouldFocusInput: false }));
      }, 100); // Short delay to ensure the input is ready
      return () => clearTimeout(timer);
    }
  }, [gameState.shouldFocusInput, setGameState]);

  return {
    handleNoMoreWords,
    handleNextWord,
    handleRetry,
    handleShowHint,
  };
};

export default useCommonGameLogic;