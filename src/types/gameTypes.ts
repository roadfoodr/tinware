// Generated on 2024-08-01 at 09:30 AM EDT

import { WordItem } from '../db';

export type GameType = 'AddOne' | 'BingoStem';

export interface FormattedAnswer extends WordItem {
  formattedDefinition: string;
  takesS: string;
  isRemaining?: boolean;
  isRootWithNoLetters?: boolean;
}

export interface PlayGameProps {
  data: WordItem[];
  gametype: GameType;
  onSkipWord: () => void;
  selectedTopic: string;
}

export interface SuccessMessage {
  text: string;
  class: 'all-words' | 'some-words';
}

export interface ErrorMessage {
  text: string;
}

export interface HintMessage {
  text: string;
}

export interface GameState {
  answerSet: FormattedAnswer[];
  userInput: string;
  displayedAnswers: FormattedAnswer[];
  showAllAnswers: boolean;
  skipButtonLabel: string;
  errorMessage: ErrorMessage | null;
  successMessage: SuccessMessage | null;
  hint: HintMessage | null;
  showHint: boolean;
  isTransitioning: boolean;
  shouldFocusInput: boolean;
  showRetry: boolean;
  currentScenarioID?: string;
  gameType: GameType;
}

export interface Scenario {
  id: string;
  subtopic: string;
  root: string;
  answers: FormattedAnswer[];
}

export interface GameContext {
  currentScenario: Scenario | null;
  setCurrentScenario: (scenario: Scenario | null) => void;
  gameState: GameState;
  setGameState: (state: GameState) => void;
}