import { WordItem } from '../db';
import { FormattedAnswer, ErrorMessage, HintMessage, GameType } from '../types/gameTypes';
import { CONFIG } from '../config/config';
import { isValidLetterCombination } from './GameUtils';

export const formatAnswer = (item: WordItem): FormattedAnswer => {
  let takesS = '';

  if (item.definition && item.definition !== 'Not a valid word in this lexicon' && item.canAddS !== undefined) {
    if (item.canAddS) {
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
    if (!isValidLetterCombination(uppercaseInput, currentScenario.root, currentScenario.subtopic)) {
      return { 
        newAnswer: null, 
        isValid: false, 
        isRepeated: false,
        message: {
          text: `Entry must include only the letters <span class="root">${currentScenario.root.toUpperCase()}</span> + <span class="root">${currentScenario.subtopic.toUpperCase()}</span>.`
        }
      };
    }
  }

  const matchingAnswer = answerSet.find(item => 
    isBingoStem 
      ? item.answerWord.toUpperCase() === uppercaseInput
      : item.answer.toUpperCase() === uppercaseInput
  );

  if (matchingAnswer) {
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