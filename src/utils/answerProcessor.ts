// Generated on 2024-08-01 at 15:00 PM EDT

import { WordItem } from '../db';
import { SuccessMessage, ErrorMessage, HintMessage, GameType } from '../types/gameTypes';
import { CONFIG } from '../config/config';

export interface FormattedAnswer extends WordItem {
  formattedDefinition: string;
  takesS: string;
  isRemaining?: boolean;
  isRootWithNoLetters?: boolean;
}

export const formatAnswer = (item: WordItem): FormattedAnswer => {
  let takesS = '';

  if (item.definition && item.definition !== 'Not a valid word in this lexicon' && item.canAddS !== undefined) {
    const canAddS = typeof item.canAddS === 'string' 
      ? item.canAddS.toUpperCase() === 'TRUE'
      : Boolean(item.canAddS);

    if (canAddS) {
      takesS = `can add S: ${item.answerWord.toUpperCase()}S`;
    } else {
      if (item.answerWord.toUpperCase().endsWith('S')) {
        takesS = `already ends in S`;
      } else {
        takesS = `can not add S`;
      }
    }
  }

  return {
    ...item,
    formattedDefinition: item.definition || '',
    takesS
  };
};

const isValidLetterCombination = (input: string, root: string, subtopic: string): boolean => {
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

export const processAnswer = (
  input: string,
  answerSet: FormattedAnswer[],
  displayedAnswers: FormattedAnswer[],
  isBingoStem: boolean = false
): { newAnswer: FormattedAnswer | null; isValid: boolean; isRepeated: boolean; message: ErrorMessage | HintMessage | null } => {
  const uppercaseInput = input.toUpperCase();

  if (answerSet.length === 0) {
    return { newAnswer: null, isValid: false, isRepeated: false, message: null };
  }

  const currentScenario = answerSet[0];

  if (isBingoStem) {
    // For BingoStem, first check if the letter combination is valid
    if (!isValidLetterCombination(uppercaseInput, currentScenario.root, currentScenario.subtopic)) {
      return { 
        newAnswer: null, 
        isValid: false, 
        isRepeated: false,
        message: {
          text: `Answer must include only the letters <span class="root">${currentScenario.root.toUpperCase()}</span> + <span class="root">${currentScenario.subtopic.toUpperCase()}</span>.`
        }
      };
    }
  }

  // Check if the input matches any answer in the answerSet
  const matchingAnswer = answerSet.find(item => 
    isBingoStem 
      ? item.answerWord.toUpperCase() === uppercaseInput
      : item.answer.toUpperCase() === uppercaseInput
  );

  if (matchingAnswer) {
    // Check if this answer has already been displayed
    const isAlreadyDisplayed = displayedAnswers.some(
      displayed => displayed.answerWord === matchingAnswer.answerWord
    );

    if (!isAlreadyDisplayed) {
      return { 
        newAnswer: matchingAnswer,
        isValid: true,
        isRepeated: false,
        message: null
      };
    } else {
      return {
        newAnswer: null,
        isValid: true,
        isRepeated: true,
        message: null
      };
    }
  }

  // If no matching answer found, create an invalid answer
  const lexiconName = CONFIG.LEXICON_NAME || "this lexicon";
  const invalidAnswer: FormattedAnswer = {
    ...currentScenario,
    answerWord: isBingoStem ? uppercaseInput : (currentScenario.subtopic === 'before' ? uppercaseInput + currentScenario.root : currentScenario.root + uppercaseInput),
    formattedDefinition: `Not a valid word in ${lexiconName}`,
    answer: uppercaseInput,
    takesS: ''
  };

  const isAlreadyDisplayed = displayedAnswers.some(
    displayed => displayed.answerWord === invalidAnswer.answerWord
  );

  if (!isAlreadyDisplayed) {
    return { 
      newAnswer: invalidAnswer, 
      isValid: false, 
      isRepeated: false,
      message: { text: invalidAnswer.formattedDefinition }
    };
  } else {
    return { newAnswer: null, isValid: false, isRepeated: true, message: null };
  }
};

export const processRemainingAnswers = (
  answerSet: FormattedAnswer[],
  displayedAnswers: FormattedAnswer[]
): FormattedAnswer[] => {
  if (answerSet.every(item => item.answer === '-')) {
    // Handle the case where there are no valid answers
    const rootWord = answerSet[0];
    if (rootWord.definition) {
      // If the root has a definition, return it as a valid answer
      return [{
        ...rootWord,
        answerWord: rootWord.root.toUpperCase(),
        isRemaining: false,
        isRootWithNoLetters: true
      }];
    }
    // If the root doesn't have a definition, return an empty array
    return [];
  }
  
  // Filter out already displayed answers and invalid answers
  return answerSet.filter(item => 
    item.answer !== '-' &&
    item.definition &&
    item.definition !== 'Not a valid word in this lexicon' &&
    !displayedAnswers.some(displayed => displayed.answerWord === item.answerWord)
  ).map(item => ({ 
    ...item,
    isRemaining: true
  })).reverse(); // Reverse the order of remaining answers
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