import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GameState, GameType, FormattedAnswer } from '../types/gameTypes';
import { CONFIG } from '../config/config';

interface GameContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  currentScenario: FormattedAnswer[] | null;
  setCurrentScenario: React.Dispatch<React.SetStateAction<FormattedAnswer[] | null>>;
  selectedTopic: string | null;
  setSelectedTopic: React.Dispatch<React.SetStateAction<string | null>>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
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
    gameType: 'AddOne',
  });

  const [currentScenario, setCurrentScenario] = useState<FormattedAnswer[] | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
        currentScenario,
        setCurrentScenario,
        selectedTopic,
        setSelectedTopic,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;