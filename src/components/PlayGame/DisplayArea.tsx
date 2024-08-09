import React from 'react';
import { useGameContext } from '../../context/GameContext';
import { CONFIG } from '../../config/config';

const DisplayArea: React.FC = () => {
  const { gameState } = useGameContext();
  const { displayedAnswers, showAllAnswers } = gameState;

  // New function to strip non-alphabetic characters
  const stripNonAlphabetic = (word: string) => {
    return word.replace(/[^a-zA-Z]/g, '');
  };

  return (
    <div className="display-area">
      {displayedAnswers.filter(item => item.formattedDefinition).map((item, index) => {
        const isInvalid = item.formattedDefinition.startsWith('Not a valid word in');
        const rowClass = isInvalid ? 'invalid' :
                         item.isRootWithNoLetters ? 'valid' :
                         showAllAnswers && item.isRemaining ? 'missed' : 'valid';
        
const canAddSClass = item.canAddS ? `can-add-s-${rowClass}` : 'can-add-s-default';
        
        const isValidOrMissed = rowClass === 'valid' || rowClass === 'missed';
        
        return (
          <div key={index} className={`answer-row ${rowClass}`}>
            <span className="answer-word root">
              {isValidOrMissed ? (
                <a 
                  href={`${CONFIG.DICT_URL}/${stripNonAlphabetic(item.answerWord)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="root-link"
                >
                  {stripNonAlphabetic(item.answerWord).toUpperCase()}
                </a>
              ) : (
                stripNonAlphabetic(item.answerWord).toUpperCase()
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