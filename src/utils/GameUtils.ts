import { WordItem } from '../db';
import { FormattedAnswer, GameType, SuccessMessage } from '../types/gameTypes';

export const isValidLetterCombination = (input: string, root: string, subtopic: string): boolean => {
  const allowedLetters = (root + subtopic).toUpperCase();
  const inputLetters = input.toUpperCase();

  if (inputLetters.length !== allowedLetters.length) return false;

  const allowedLetterCount = new Map<string, number>();
  const inputLetterCount = new Map<string, number>();

  for (const letter of allowedLetters) {
    allowedLetterCount.set(letter, (allowedLetterCount.get(letter) || 0) + 1);
  }

  for (const letter of inputLetters) {
    inputLetterCount.set(letter, (inputLetterCount.get(letter) || 0) + 1);
  }

  if (allowedLetterCount.size !== inputLetterCount.size) return false;

  for (const [letter, count] of allowedLetterCount) {
    if (inputLetterCount.get(letter) !== count) return false;
  }

  return true;
};

export const processRemainingAnswers = (
  answerSet: FormattedAnswer[],
  displayedAnswers: FormattedAnswer[]
): FormattedAnswer[] => {
  if (answerSet.every(item => item.answer === '-')) {
    const rootWord = answerSet[0];
    if (rootWord.definition) {
      return [{
        ...rootWord,
        answerWord: rootWord.root.toUpperCase(),
        isRemaining: false,
        isRootWithNoLetters: true
      }];
    }
    return [];
  }
  
  return answerSet.filter(item => 
    item.answer !== '-' &&
    item.definition &&
    item.definition !== 'Not a valid word in this lexicon' &&
    !displayedAnswers.some(displayed => displayed.answerWord === item.answerWord)
  ).map(item => ({ 
    ...item,
    isRemaining: true
  })).reverse();
};

export const calculateSuccessMessage = (
  answerSet: FormattedAnswer[],
  displayedAnswers: FormattedAnswer[],
  gameType: GameType
): SuccessMessage => {
  const correctAnswers = answerSet.filter(item => 
    item.answer !== '-' && 
    item.definition && 
    item.definition !== 'Not a valid word in this lexicon'
  );
  
  const identifiedCorrectAnswers = displayedAnswers.filter(item => 
    item.definition && 
    item.definition !== 'Not a valid word in this lexicon' && 
    item.answer !== '-' &&
    !item.isRemaining &&
    correctAnswers.some(correctItem => correctItem.answerWord === item.answerWord)
  );

  if (answerSet.every(item => item.answer === '-')) {
    if (gameType === 'AddOne') {
      return {
        text: `There are no letters that can go ${answerSet[0].subtopic} <span class="root">${answerSet[0].root.toUpperCase()}</span>.`,
        class: 'all-words'
      };
    } else if (gameType === 'BingoStem') {
      return {
        text: `There are no bingos that can be made from <span class="root">${answerSet[0].root.toUpperCase()}</span> + <span class="root">${answerSet[0].subtopic.toUpperCase()}</span>.`,
        class: 'all-words'
      };
    }
  } else if (correctAnswers.length === 0) {
    return {
      text: `There are no valid words for this scenario.`,
      class: 'all-words'
    };
  } else if (identifiedCorrectAnswers.length === correctAnswers.length) {
    return {
      text: `You correctly identified all ${correctAnswers.length} word${correctAnswers.length > 1 ? 's' : ''}!`,
      class: 'all-words'
    };
  } else {
    return {
      text: `You identified ${identifiedCorrectAnswers.length} out of ${correctAnswers.length} word${correctAnswers.length > 1 ? 's' : ''}`,
      class: 'some-words'
    };
  }
};

export const getRandomScenario = (scenarios: string[], previousScenarioId: string | null): string | null => {
  if (scenarios.length === 0) return null;
  if (scenarios.length === 1) return scenarios[0];

  let availableScenarios = previousScenarioId
    ? scenarios.filter(id => id !== previousScenarioId)
    : scenarios;

  if (availableScenarios.length === 0) {
    // If all scenarios have been filtered out (shouldn't happen in normal cases),
    // fall back to the full list minus the previous scenario
    availableScenarios = scenarios.filter(id => id !== previousScenarioId);
  }

  const randomIndex = Math.floor(Math.random() * availableScenarios.length);
  return availableScenarios[randomIndex];
};

export const processScenarioData = (scenarioData: any[]): WordItem[] => {
  return scenarioData.map(item => ({
    ...item,
    answerWord: String(item.answerWord || '').toUpperCase(),
    definition: String(item.definition || ''),
    canAddS: (() => {
      if (typeof item.canAddS === 'boolean') {
        return item.canAddS;
      }
      if (typeof item.canAddS === 'string') {
        return item.canAddS.toUpperCase() === 'TRUE';
      }
      // Default to false if canAddS is undefined or of unexpected type
      return false;
    })()
  }));
};