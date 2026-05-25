import { useCallback } from 'react';
import type { KeyboardEvent } from 'react';
import { useGameContext } from '../context/GameContext';
import { getGameType } from '../gameTypes';
import { processAnswer } from '../utils/answerProcessor';
import { useSounds } from '../hooks/useSounds';

export const useGameInput = () => {
  const { gameState, setGameState, currentScenario } = useGameContext();
  const { playSound } = useSounds();

  const gameDef = getGameType(gameState.gameType);

  /**
   * Core submission logic shared by auto-submit and explicit submit paths.
   */
  const submitAnswer = useCallback((input: string) => {
    if (!currentScenario) return;

    setGameState(prev => {
      const { newAnswer, isValid, isRepeated, message } = processAnswer(
        input, currentScenario, prev.displayedAnswers, gameDef
      );

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
          invalidSubmissionCount: isValid
            ? prev.invalidSubmissionCount
            : prev.invalidSubmissionCount + 1,
        };
      }

      // Input failed pre-validation (e.g. wrong letters in BingoStem)
      if (message) {
        playSound('hintRequested');
        return {
          ...prev,
          userInput: '',
          errorMessage: null,
          hint: message,
          showHint: true,
          successMessage: null,
        };
      }

      return { ...prev, userInput: '' };
    });
  }, [currentScenario, setGameState, gameDef, playSound]);

  /**
   * Called on every input change (keystroke / paste).
   */
  const handleInputChange = useCallback((input: string) => {
    if (gameState.showAllAnswers) return;

    const filtered = gameDef.filterInput(input);

    if (gameDef.shouldAutoSubmit(filtered)) {
      // Auto-submit path (e.g. AddOne single letter)
      submitAnswer(filtered);
    } else {
      // Just update the input field (e.g. BingoStem typing)
      setGameState(prev => ({
        ...prev,
        userInput: filtered,
        errorMessage: null,
        successMessage: null,
        showHint: false,
      }));
    }
  }, [gameState.showAllAnswers, gameDef, submitAnswer, setGameState]);

  /**
   * Called on keydown events in the input field.
   */
  const handleKeyPress = useCallback((key: string, event: KeyboardEvent) => {
    if (gameState.showAllAnswers) return;

    if (key === ' ') {
      event.preventDefault();
    }

    // For auto-submit game types, letter keys trigger via handleInputChange,
    // so we only need to handle Enter for explicit-submit types here.
    if (key === 'Enter' && gameDef.inputConfig.requiresExplicitSubmit) {
      if (gameState.userInput.length === gameDef.inputConfig.maxLength) {
        submitAnswer(gameState.userInput);
      }
    }
  }, [gameState.showAllAnswers, gameState.userInput, gameDef, submitAnswer]);

  /**
   * Called by the Submit button (explicit-submit game types only).
   */
  const handleSubmit = useCallback(() => {
    if (gameState.showAllAnswers) return;
    if (gameDef.inputConfig.requiresExplicitSubmit) {
      submitAnswer(gameState.userInput);
    }
  }, [gameState.showAllAnswers, gameState.userInput, gameDef, submitAnswer]);

  return {
    handleInputChange,
    handleKeyPress,
    handleSubmit,
  };
};

export default useGameInput;
