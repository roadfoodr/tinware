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

export const calculateScore = (
  validWordsIdentified: number,
  wordsMissed: number,
  invalidWordsGuessed: number,
  hintsRequested: number
): number => {
  // If there are no valid words, treat it as if there was one valid word identified
  const effectiveValidWords = validWordsIdentified + wordsMissed === 0 ? 1 : validWordsIdentified;
  
  const denominator = effectiveValidWords + wordsMissed + invalidWordsGuessed + 0.5 * hintsRequested;
  
  // Use effectiveValidWords in the numerator as well
  return Math.round((effectiveValidWords * 100) / denominator);
};

export const calculateSuccessMessage = (
  answerSet: FormattedAnswer[],
  displayedAnswers: FormattedAnswer[],
  gameType: GameType,
  score: number
): SuccessMessage => {
  // Filter out placeholder answers ('-') to get actual valid answers
  const validAnswers = answerSet.filter(item => item.answerWord !== '-');
  
  const validAnswersInSet = new Set(validAnswers.map(item => item.answerWord));
  
  const identifiedCorrectAnswers = displayedAnswers.filter(item => 
    !item.isRemaining && validAnswersInSet.has(item.answerWord)
  );

  let messageText = '';
  let messageClass: 'all-words' | 'some-words' = 'some-words';
  console.log(validAnswers)
  if (validAnswers.length === 0) {
    if (gameType === 'AddOne') {
      messageText = `There are no letters that can go ${answerSet[0].subtopic} <span class="root">${answerSet[0].root.toUpperCase()}</span>.`;
    } else if (gameType === 'BingoStem') {
      messageText = `There are no bingos that can be made from <span class="root">${answerSet[0].root.toUpperCase()}</span> + <span class="root">${answerSet[0].subtopic.toUpperCase()}</span>.`;
    }
    messageClass = 'all-words';
  } else if (identifiedCorrectAnswers.length === validAnswers.length) {
    messageText = `You correctly identified all ${validAnswers.length} word${validAnswers.length > 1 ? 's' : ''}` +
                  `${score == 100 ? '!' : ''}`;
    messageClass = 'all-words';
  } else {
    messageText = `You identified ${identifiedCorrectAnswers.length} out of ${validAnswers.length} word${validAnswers.length > 1 ? 's' : ''}`;
  }

  messageText += `<br><span class="score">(Score: ${score})</span>`;

  return {
    text: messageText,
    class: messageClass
  };
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
