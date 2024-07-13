// Generated on 2024-07-13 at 16:05 PM EDT

import { WordItem } from '../db';
import { SuccessMessage } from '../types/gameTypes';
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
    const canAddS = item.canAddS.toUpperCase();
    if (canAddS === 'TRUE') {
      takesS = `can add S: ${item.answerWord.toUpperCase()}S`;
    } else if (canAddS === 'FALSE') {
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

export const processAnswer = (
  input: string,
  answerSet: FormattedAnswer[],
  displayedAnswers: FormattedAnswer[]
): { newAnswer: FormattedAnswer | null; isValid: boolean; isRepeated: boolean } => {
  const uppercaseInput = input.toUpperCase();

  // Check if the input matches any answer in the answerSet
  const matchingAnswer = answerSet.find(item => item.answer.toUpperCase() === uppercaseInput);

  if (matchingAnswer) {
    // Check if this answer has already been displayed
    const isAlreadyDisplayed = displayedAnswers.some(
      displayed => displayed.answerWord === matchingAnswer.answerWord
    );

    if (!isAlreadyDisplayed) {
      return { 
        newAnswer: matchingAnswer,
        isValid: true,
        isRepeated: false
      };
    } else {
      return {
        newAnswer: null,
        isValid: true,
        isRepeated: true
      };
    }
  }

  // If no matching answer found, create an invalid answer
  if (answerSet.length > 0) {
    const lexiconName = CONFIG.LEXICON_NAME || "this lexicon";
    const invalidAnswer: FormattedAnswer = {
      ...answerSet[0],
      answerWord: answerSet[0].subtopic === 'before' ? uppercaseInput + answerSet[0].root : answerSet[0].root + uppercaseInput,
      formattedDefinition: `Not a valid word in ${lexiconName}`,
      answer: uppercaseInput,
      takesS: ''
    };

    const isAlreadyDisplayed = displayedAnswers.some(
      displayed => displayed.answerWord === invalidAnswer.answerWord
    );

    if (!isAlreadyDisplayed) {
      return { newAnswer: invalidAnswer, isValid: false, isRepeated: false };
    } else {
      return { newAnswer: null, isValid: false, isRepeated: true };
    }
  }

  // If there's no answerSet, return null
  return { newAnswer: null, isValid: false, isRepeated: false };
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
  displayedAnswers: FormattedAnswer[]
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
    return {
      text: `There are no letters that can go ${answerSet[0].subtopic} ${answerSet[0].root.toUpperCase()}.`,
      class: 'all-words'
    };
  } else if (correctAnswers.length === 0) {
    return {
      text: `There are no valid words for this root.`,
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