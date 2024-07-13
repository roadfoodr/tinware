// Generated on 2024-07-13 at 15:35 PM EDT

import React from 'react';
import { FormattedAnswer } from '../../utils/answerProcessor';
import { CONFIG } from '../../config/config';

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
        const isInvalid = item.formattedDefinition.startsWith('Not a valid word in');
        const rowClass = isInvalid ? 'invalid' :
                         item.isRootWithNoLetters ? 'valid' :
                         showAllAnswers && item.isRemaining ? 'missed' : 'valid';
        
        const canAddSClass = item.takesS.startsWith('can add S:') ? `can-add-s-${rowClass}` : 'can-add-s-default';
        
        const isValidOrMissed = rowClass === 'valid' || rowClass === 'missed';
        
        return (
          <div key={index} className={`answer-row ${rowClass}`}>
            <span className="answer-word root">
              {isValidOrMissed ? (
                <a 
                  href={`${CONFIG.DICT_URL}/${item.answerWord}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="root-link"
                >
                  {item.answerWord.toUpperCase()}
                </a>
              ) : (
                item.answerWord.toUpperCase()
              )}
            </span>
            <span className="definition">{item.formattedDefinition}</span>
            {item.takesS && (
              <span className={`can-add-s ${canAddSClass} root`}>
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