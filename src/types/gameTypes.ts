// Generated on 2024-07-10 at 22:00 PM EDT

import { WordItem } from '../db';

export interface PlayGameProps {
  data: WordItem[];
  gametype: string;
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
  answerSet: WordItem[];
  userInput: string;
  displayedAnswers: WordItem[];
  showAllAnswers: boolean;
  skipButtonLabel: string;
  errorMessage: ErrorMessage | null;
  successMessage: SuccessMessage | null;
  hint: HintMessage | null;
  showHint: boolean;
  isTransitioning: boolean;
}