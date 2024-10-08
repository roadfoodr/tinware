import { useCallback, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { FormattedAnswer } from '../types/gameTypes';
import { useSounds } from '../hooks/useSounds';
import { CONFIG } from '../config/config';
import { processRemainingAnswers, calculateSuccessMessage, calculateScore } from '../utils/GameUtils';

export const useCommonGameLogic = (onSkipWord: () => void) => {
  const { gameState, setGameState, currentScenario } = useGameContext();
  const { playSound } = useSounds();

  useEffect(() => {
    if (currentScenario) {
      setGameState(prev => ({ ...prev, lastHintType: null, hintCount: 0, score: null }));
    }
  }, [currentScenario, setGameState]);

  const handleShowHint = useCallback(() => {
    playSound('hintRequested');
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

    const unidentifiedWords = validAnswers.filter(item => 
      !identifiedValidAnswers.some(identified => identified.answerWord === item.answerWord)
    );

    let hintMessage: string;
    let newHintType: 'count' | 'definition';

    if (gameState.lastHintType === 'count' && unidentifiedWords.length > 0) {
      const randomWord = unidentifiedWords[Math.floor(Math.random() * unidentifiedWords.length)];
      hintMessage = `Hint: ${randomWord.definition}`;
      newHintType = 'definition';
    } else {
      if (validAnswers.length === 0 && identifiedValidAnswers.length === 0) {
        hintMessage = "There are no possible valid words";
      } else {
        hintMessage = `You have identified ${identifiedValidAnswers.length} out of ${validAnswers.length} possible valid words`;
      }
      newHintType = 'count';
    }

    setGameState(prev => ({ 
      ...prev, 
      showHint: true,
      hint: { text: hintMessage },
      errorMessage: null,
      successMessage: null,
      lastHintType: newHintType,
      shouldFocusInput: false,
      hintCount: prev.hintCount + 1
    }));

    setTimeout(() => {
      setGameState(prev => ({ ...prev, shouldFocusInput: true }));
    }, 100);
  }, [currentScenario, gameState.displayedAnswers, gameState.lastHintType, setGameState, playSound]);

  const handleNextWord = useCallback(() => {
    setGameState(prev => ({ 
      ...prev, 
      isTransitioning: true, 
      shouldFocusInput: false,
      hintCount: 0,
      score: null
    }));
    onSkipWord();
    setTimeout(() => {
      setGameState(prev => ({ 
        ...prev, 
        isTransitioning: false,
        shouldFocusInput: true,
        lastHintType: null
      }));
    }, CONFIG.GAME.TRANSITION_DELAY_MS);
  }, [setGameState, onSkipWord]);

  const handleNoMoreWords = useCallback(() => {
    if (!currentScenario) return;

    setGameState(prev => {
      if (prev.showAllAnswers) return prev;

      const remainingAnswers = processRemainingAnswers(currentScenario, prev.displayedAnswers);
      const newDisplayedAnswers = [...remainingAnswers, ...prev.displayedAnswers];
      
      const validAnswers = currentScenario.filter(item => item.answer !== '-');
      const validAnswersInSet = new Set(validAnswers.map(item => item.answerWord));

      const validWordsIdentified = newDisplayedAnswers.filter(answer => 
        !answer.isRemaining && validAnswersInSet.has(answer.answerWord)
      ).length;
      
      const wordsMissed = remainingAnswers.length;
      const invalidWordsGuessed = newDisplayedAnswers.filter(answer => 
        !validAnswersInSet.has(answer.answerWord) && answer.answer !== '-'
      ).length;

      const score = calculateScore(validWordsIdentified, wordsMissed, invalidWordsGuessed, prev.hintCount);
      
      const successMessage = calculateSuccessMessage(currentScenario, newDisplayedAnswers, prev.gameType, score);

      if (score === 100) {
        playSound('scenarioSuccess');
      } else {
        playSound('scenarioComplete');
      }

      return {
        ...prev,
        showAllAnswers: true,
        displayedAnswers: newDisplayedAnswers,
        successMessage,
        skipButtonLabel: 'Next Word',
        showRetry: true,
        showHint: false,
        userInput: '',
        lastHintType: null,
        shouldFocusInput: true,
        score
      };
    });
  }, [currentScenario, setGameState, playSound]);

  const handleRetry = useCallback(() => {
    if (!currentScenario) return;

    setGameState(prev => ({
      ...prev,
      isTransitioning: true,
      shouldFocusInput: false,
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
      invalidSubmissionCount: 0,
      lastHintType: null,
      hintCount: 0,
      score: null
    }));
    
    setTimeout(() => {
      setGameState(prev => ({ 
        ...prev, 
        isTransitioning: false,
        shouldFocusInput: true 
      }));
    }, CONFIG.GAME.TRANSITION_DELAY_MS);
  }, [currentScenario, setGameState]);

  return {
    handleShowHint,
    handleNextWord,
    handleNoMoreWords,
    handleRetry
  };
};

export default useCommonGameLogic;