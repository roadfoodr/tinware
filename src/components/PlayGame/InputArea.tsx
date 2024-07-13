// Generated on 2024-07-11 at 21:40 PM EDT

import React, { forwardRef } from 'react';
import { FormattedAnswer } from '../../utils/answerProcessor';

interface InputAreaProps {
  answerSet: FormattedAnswer[];
  userInput: string;
  showAllAnswers: boolean;
  onInputChange: (input: string) => void;
}

const InputArea = forwardRef<HTMLInputElement, InputAreaProps>(
  ({ answerSet, userInput, showAllAnswers, onInputChange }, ref) => {
    if (answerSet.length === 0 || showAllAnswers) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onInputChange(e.target.value.slice(-1).toUpperCase());
    };

    return (
      <div className="input-area">
        {answerSet[0].subtopic === 'before' && (
          <input
            type="text"
            ref={ref}
            value={userInput}
            onChange={handleChange}
            maxLength={1}
            className="pure-input-1-6"
          />
        )}
        <span className="root">{answerSet[0].root.toUpperCase()}</span>
        {answerSet[0].subtopic === 'after' && (
          <input
            type="text"
            ref={ref}
            value={userInput}
            onChange={handleChange}
            maxLength={1}
            className="pure-input-1-6"
          />
        )}
      </div>
    );
  }
);

export default InputArea;