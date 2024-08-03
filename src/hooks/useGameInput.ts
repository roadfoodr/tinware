import { useCallback } from 'react';
import { useGameContext } from '../context/GameContext';
import { useAddOneLogic } from './useAddOneLogic';
import { useBingoStemLogic } from './useBingoStemLogic';

export const useGameInput = () => {
  const { gameState } = useGameContext();
  const addOneLogic = useAddOneLogic();
  const bingoStemLogic = useBingoStemLogic();

  const handleInputChange = useCallback((input: string) => {
    if (gameState.showAllAnswers) return;

    if (gameState.gameType === 'AddOne') {
      addOneLogic.handleInputChange(input);
    } else if (gameState.gameType === 'BingoStem') {
      bingoStemLogic.handleInputChange(input);
    }
  }, [gameState.gameType, gameState.showAllAnswers, addOneLogic, bingoStemLogic]);

  const handleKeyPress = useCallback((key: string, event: React.KeyboardEvent) => {
    if (gameState.showAllAnswers) return;

    if (key === ' ') {
      event.preventDefault();
    }
    if (gameState.gameType === 'AddOne') {
      addOneLogic.handleKeyPress(key);
    } else if (gameState.gameType === 'BingoStem') {
      bingoStemLogic.handleKeyPress(key);
    }
  }, [gameState.gameType, gameState.showAllAnswers, addOneLogic, bingoStemLogic]);

  const handleSubmit = useCallback(() => {
    if (gameState.showAllAnswers) return;

    if (gameState.gameType === 'BingoStem') {
      bingoStemLogic.handleSubmit();
    }
  }, [gameState.gameType, gameState.showAllAnswers, bingoStemLogic]);

  return {
    handleInputChange,
    handleKeyPress,
    handleSubmit,
  };
};

export default useGameInput;