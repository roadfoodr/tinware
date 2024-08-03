import { useCallback } from 'react';
import { useGameContext } from '../context/GameContext';
import { FormattedAnswer } from '../types/gameTypes';
import { processAnswer } from '../utils/answerProcessor';

export const useAddOneLogic = () => {
  const { gameState, setGameState, currentScenario } = useGameContext();

  const handleInputChange = useCallback((input: string) => {
    if (!currentScenario) return;

    const uppercaseInput = input.toUpperCase();
    if (!/^[A-Z]$/.test(uppercaseInput)) return;

    setGameState(prev => {
      const { newAnswer, isValid, isRepeated, message } = processAnswer(uppercaseInput, currentScenario, prev.displayedAnswers);
      
      if (isRepeated) {
        return { ...prev, userInput: '' };
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
        userInput: '',
        errorMessage: message,
        successMessage: null,
        showHint: false,
      };
    });
  }, [currentScenario, setGameState]);

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