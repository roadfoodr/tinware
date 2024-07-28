// Generated on 2024-07-29 at 12:00 PM EDT

import React, { forwardRef } from 'react';
import { FormattedAnswer } from '../../types/gameTypes';

interface InputAreaProps {
  answerSet: FormattedAnswer[];
  userInput: string;
  showAllAnswers: boolean;
  onInputChange: (input: string) => void;
}

const InputArea = forwardRef<HTMLInputElement, InputAreaProps>(
  ({ answerSet, userInput, showAllAnswers, onInputChange }, ref) => {
    if (answerSet.length === 0 || showAllAnswers) return null;

    const currentScenario = answerSet[0];
    const { subtopic, root } = currentScenario;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onInputChange(e.target.value.slice(-1).toUpperCase());
    };

    return (
      <div className="input-area">
        {subtopic === 'before' && (
          <input
            type="text"
            ref={ref}
            value={userInput}
            onChange={handleChange}
            maxLength={1}
            className="pure-input-1-6"
            aria-label="Enter letter before the root"
          />
        )}
        <span className="root">{root.toUpperCase()}</span>
        {subtopic === 'after' && (
          <input
            type="text"
            ref={ref}
            value={userInput}
            onChange={handleChange}
            maxLength={1}
            className="pure-input-1-6"
            aria-label="Enter letter after the root"
          />
        )}
      </div>
    );
  }
);

InputArea.displayName = 'InputArea';

export default InputArea;