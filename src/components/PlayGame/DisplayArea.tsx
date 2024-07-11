// Generated on 2024-07-11 at 21:00 PM EDT

import React from 'react';
import { FormattedAnswer } from '../utils/answerProcessor';

interface DisplayAreaProps {
  displayedAnswers: FormattedAnswer[];
  showAllAnswers: boolean;
  hint: string;
  showHint: boolean;
}

const DisplayArea: React.FC<DisplayAreaProps> = ({ displayedAnswers, showAllAnswers, hint, showHint }) => {
  return (
    <div className="display-area">
      {showHint && hint && (
        <div className="hint-message">Hint: {hint}</div>
      )}
      {displayedAnswers.filter(item => item.formattedDefinition).map((item, index) => {
        const rowClass = item.formattedDefinition === 'Not a valid word in this lexicon' ? 'invalid' :
                         item.isRootWithNoLetters ? 'valid' :
                         showAllAnswers && item.isRemaining ? 'missed' : 'valid';
        
        const canAddSClass = item.takesS.startsWith('can add S:') ? `can-add-s-${rowClass}` : 'can-add-s-default';
        
        return (
          <div key={index} className={`answer-row ${rowClass}`}>
            <span className="answer-word">{item.isRootWithNoLetters ? item.root.toUpperCase() : item.answerWord.toUpperCase()}</span>
            <span className="definition">{item.formattedDefinition}</span>
            {item.takesS && (
              <span className={`can-add-s root ${canAddSClass}`}>
                {' '}{item.takesS}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DisplayArea;