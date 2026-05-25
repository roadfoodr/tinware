import type { KeyboardEvent, ReactNode, Ref } from 'react';
import { FormattedAnswer } from '../types/gameTypes';

/**
 * Validation result returned by a game type's validateInput method.
 * If valid is false and message is provided, it will be shown as a hint/error.
 */
export interface InputValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * Result of matching user input against the answer set.
 * Used by the shared answer processing pipeline.
 */
export interface AnswerMatchResult {
  newAnswer: FormattedAnswer | null;
  isValid: boolean;
  isRepeated: boolean;
  message: { text: string } | null;
}

/**
 * Props passed to a game type's renderPrompt function.
 */
export interface GamePromptRenderProps {
  scenario: FormattedAnswer;
  selectedTopic: string;
}

/**
 * Props passed to a game type's renderInput function.
 */
export interface GameInputRenderProps {
  inputRef: Ref<HTMLInputElement>;
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent) => void;
  onSubmit: () => void;
  disabled: boolean;
  isSubmitDisabled: boolean;
  scenario: FormattedAnswer;
}

/**
 * The contract every game type must implement.
 *
 * Game types are self-contained modules that define how input is handled,
 * how answers are validated, and how the prompt and input areas render.
 * The shared game framework (hints, scoring, retry, display) operates
 * identically regardless of game type.
 */
export interface GameTypeDefinition {
  /** Unique key matching the GameType union, e.g. 'AddOne', 'BingoStem' */
  key: string;

  /** Input behavior configuration */
  inputConfig: {
    /** Maximum character length of the input field */
    maxLength: number;
    /** If true, user must press Enter or click Submit to validate */
    requiresExplicitSubmit: boolean;
  };

  /**
   * Normalize/filter raw input text (e.g. uppercase, strip non-alpha).
   * Called on every keystroke before any further processing.
   */
  filterInput: (input: string) => string;

  /**
   * Should the current (filtered) input be auto-submitted without
   * the user pressing Enter? Return true to trigger immediate validation.
   * Only relevant when requiresExplicitSubmit is false.
   */
  shouldAutoSubmit: (input: string) => boolean;

  /**
   * Render the challenge prompt area for this game type.
   */
  renderPrompt: (props: GamePromptRenderProps) => ReactNode;

  /**
   * Render the input area for this game type.
   */
  renderInput: (props: GameInputRenderProps) => ReactNode;

  /**
   * Optional pre-validation before checking input against the answer set.
   * Use this for structural validation like "are these the right letters?"
   * Return null to skip (input is structurally valid).
   */
  validateInput?: (input: string, scenario: FormattedAnswer) => InputValidationResult | null;

  /**
   * Match user input against a single answer from the answer set.
   * For AddOne, this compares the single letter to answer.answer.
   * For BingoStem, this compares the full word to answer.answerWord.
   */
  matchAnswer: (input: string, answer: FormattedAnswer) => boolean;

  /**
   * Construct the full display word from user input when the answer is invalid.
   * For AddOne with subtopic "before" and root "ATE", input "X" becomes "XATE".
   * For BingoStem, just returns the input itself.
   */
  buildAnswerWord: (input: string, scenario: FormattedAnswer) => string;
}
