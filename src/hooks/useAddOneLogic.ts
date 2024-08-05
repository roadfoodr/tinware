import { useCallback } from 'react';
import { useGameContext } from '../context/GameContext';
import { FormattedAnswer } from '../types/gameTypes';
import { processAnswer } from '../utils/answerProcessor';
import { useSounds } from '../hooks/useSounds';

export const useAddOneLogic = () => {
  const { gameState, setGameState, currentScenario } = useGameContext();
  const { playSound } = useSounds();

  const handleInputChange = useCallback((input: string) => {
    if (!currentScenario) return;

    const uppercaseInput = input.toUpperCase();
    if (!/^[A-Z]$/.test(uppercaseInput)) return;

    setGameState(prev => {
      const { newAnswer, isValid, isRepeated, message } = processAnswer(uppercaseInput, currentScenario, prev.displayedAnswers);
      
      if (isRepeated) {
        // Don't play any sound or increment invalidSubmissionCount for repeated words
        return { ...prev, userInput: '' };
      }

      if (newAnswer) {
        if (isValid) {
          playSound('validWord');
        } else {
          playSound('invalidWord');
        }
        
        return {
          ...prev,
          userInput: '',
          displayedAnswers: [newAnswer, ...prev.displayedAnswers],
          errorMessage: null,
          successMessage: null,
          showHint: false,
          // Increment invalidSubmissionCount only for new invalid words
          invalidSubmissionCount: isValid ? prev.invalidSubmissionCount : prev.invalidSubmissionCount + 1,
        };
      }

      // This case should not occur in AddOne game, but keeping it for safety
      playSound('invalidWord');
      return {
        ...prev,
        userInput: '',
        errorMessage: message,
        successMessage: null,
        showHint: false,
        invalidSubmissionCount: prev.invalidSubmissionCount + 1,
      };
    });
  }, [currentScenario, setGameState, playSound]);

  const handleKeyPress = useCallback((key: string) => {
    if (/^[a-zA-Z]$/.test(key)) {
      handleInputChange(key);
    }
  }, [handleInputChange]);

  return {
    handleInputChange,
    handleKeyPress,
  };
};

export default useAddOneLogic;