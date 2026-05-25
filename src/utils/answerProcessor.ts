import { WordItem } from '../db';
import { FormattedAnswer, ErrorMessage, HintMessage } from '../types/gameTypes';
import { CONFIG } from '../config/config';
import { GameTypeDefinition } from '../gameTypes';

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

/**
 * Process a user's answer submission using the game type definition
 * for game-specific matching and validation.
 */
export const processAnswer = (
  input: string,
  answerSet: FormattedAnswer[],
  displayedAnswers: FormattedAnswer[],
  gameDef: GameTypeDefinition
): { newAnswer: FormattedAnswer | null; isValid: boolean; isRepeated: boolean; message: ErrorMessage | HintMessage | null } => {
  const uppercaseInput = input.toUpperCase();

  if (answerSet.length === 0) {
    return { newAnswer: null, isValid: false, isRepeated: false, message: null };
  }

  const currentScenario = answerSet[0];

  // Game-specific input validation (e.g., letter combination check for BingoStem)
  if (gameDef.validateInput) {
    const validationResult = gameDef.validateInput(uppercaseInput, currentScenario);
    if (validationResult && !validationResult.valid) {
      return {
        newAnswer: null,
        isValid: false,
        isRepeated: false,
        message: validationResult.message ? { text: validationResult.message } : null,
      };
    }
  }

  // Use the game type's matchAnswer to find a matching answer
  const matchingAnswer = answerSet.find(item => gameDef.matchAnswer(uppercaseInput, item));

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

  // No match: build an invalid answer display using the game type's word builder.
  const lexiconName = CONFIG.LEXICON_NAME || "this lexicon";
  const invalidAnswer: FormattedAnswer = {
    ...currentScenario,
    answerWord: gameDef.buildAnswerWord(uppercaseInput, currentScenario),
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
