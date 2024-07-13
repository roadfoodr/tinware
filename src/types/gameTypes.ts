// Generated on 2024-07-13 at 22:30 PM EDT

import { WordItem } from '../db';

export interface FormattedAnswer extends WordItem {
  formattedDefinition: string;
  takesS: string;
  isRemaining?: boolean;
  isRootWithNoLetters?: boolean;
}

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
}