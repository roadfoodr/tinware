import { useCallback } from 'react';
import { useGameContext } from '../context/GameContext';
import { FormattedAnswer } from '../types/gameTypes';
import { processAnswer } from '../utils/answerProcessor';
import { CONFIG } from '../config/config';
import { useSounds } from '../hooks/useSounds';

export const useBingoStemLogic = () => {
  const { gameState, setGameState, currentScenario } = useGameContext();
  const { playSound } = useSounds();

  const handleInputChange = useCallback((input: string) => {
    const filteredInput = input.replace(/[^A-Za-z]/g, '').toUpperCase();
    setGameState(prev => ({
      ...prev,
      userInput: filteredInput,
      errorMessage: null,
      successMessage: null,
      showHint: false,
    }));
  }, [setGameState]);

  const handleKeyPress = useCallback((key: string) => {
    if (key === 'Enter' && gameState.userInput.length === CONFIG.GAME.BINGO_STEM_INPUT_LENGTH) {
      handleSubmit();
    }
  }, [gameState.userInput]);

  const handleSubmit = useCallback(() => {
    if (!currentScenario) return;

    setGameState(prev => {
      const { newAnswer, isValid, isRepeated, message } = processAnswer(prev.userInput, currentScenario, prev.displayedAnswers, true);
      
      if (isRepeated) {
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
          invalidSubmissionCount: isValid ? prev.invalidSubmissionCount : prev.invalidSubmissionCount + 1,
        };
      }

      // This case handles invalid letter combinations
      playSound('hintRequested');
      return {
        ...prev,
        userInput: '',
        errorMessage: message?.text.includes('Entry must include only the letters') ? null : message,
        hint: message?.text.includes('Entry must include only the letters') ? message : null,
        showHint: message?.text.includes('Entry must include only the letters'),
        successMessage: null,
        invalidSubmissionCount: prev.invalidSubmissionCount,
      };
    });
  }, [currentScenario, setGameState, playSound]);

  return {
    handleInputChange,
    handleKeyPress,
    handleSubmit,
  };
};

export default useBingoStemLogic;