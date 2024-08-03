import React, { useRef, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import AddOneGame from './AddOneGame';
import BingoStemGame from './BingoStemGame';
import GamePrompt from './PlayGame/GamePrompt';
import ControlButtons from './PlayGame/ControlButtons';
import MessageArea from './PlayGame/MessageArea';
import DisplayArea from './PlayGame/DisplayArea';

interface GameContainerProps {
  onNoMoreWords: () => void;
  onNextWord: () => void;
  onRetry: () => void;
  onShowHint: () => void;
}

const GameContainer: React.FC<GameContainerProps> = ({
  onNoMoreWords,
  onNextWord,
  onRetry,
  onShowHint
}) => {
  const { gameState, setGameState, selectedTopic } = useGameContext();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (gameState.shouldFocusInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState.shouldFocusInput]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.key === ' ') {
        if (document.activeElement === inputRef.current) {
          event.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!selectedTopic || !gameState.answerSet.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pure-u-1">
      <GamePrompt />
      {gameState.gameType === 'AddOne' && <AddOneGame ref={inputRef} />}
      {gameState.gameType === 'BingoStem' && <BingoStemGame ref={inputRef} />}
      <ControlButtons
        onNoMoreWords={onNoMoreWords}
        onSkip={onNextWord}
        onRetry={onRetry}
        onShowHint={onShowHint}
      />
      <MessageArea />
      <DisplayArea />
    </div>
  );
};

export default GameContainer;