// Generated on 2024-07-10 at 15:35 PM EDT

import React, { useState, useEffect, useRef } from 'react';
import { WordItem } from '../db';

interface PlayGameProps {
  data: WordItem[];
  gametype: string;
  onSkipWord: () => void;
  selectedTopic: string;
}

interface SuccessMessage {
  text: string | JSX.Element;
  class: 'all-words' | 'some-words';
}

const PlayGame: React.FC<PlayGameProps> = ({ data, gametype, onSkipWord, selectedTopic }) => {
  const [answerSet, setAnswerSet] = useState<WordItem[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [displayedAnswers, setDisplayedAnswers] = useState<WordItem[]>([]);
  const [showAllAnswers, setShowAllAnswers] = useState<boolean>(false);
  const [skipButtonLabel, setSkipButtonLabel] = useState<string>('Skip Word');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<SuccessMessage | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [hint, setHint] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    selectNewWord();
  }, [data]);

  useEffect(() => {
    if (inputRef.current && !showAllAnswers) {
      inputRef.current.focus();
    }
  }, [answerSet, showAllAnswers]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === ' ' && skipButtonLabel === 'Next Word' && !isTransitioning) {
        event.preventDefault();
        handleNextWord();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [skipButtonLabel, isTransitioning]);

  const selectNewWord = () => {
    if (data.length === 0) {
      setAnswerSet([]);
      setErrorMessage("No data available for the selected topic and gametype.");
      return;
    }

    const uniqueCombinations = Array.from(
      new Set(data.map(item => `${item.subtopic}-${item.root}`))
    );

    if (uniqueCombinations.length === 0) {
      setErrorMessage("No valid combinations found for the selected topic and gametype.");
      return;
    }

    const randomCombination = uniqueCombinations[Math.floor(Math.random() * uniqueCombinations.length)];
    const [selectedSubtopic, selectedRoot] = randomCombination.split('-');

    const newAnswerSet = data.filter(
      item => item.subtopic === selectedSubtopic && item.root === selectedRoot
    );

    if (newAnswerSet.length === 0) {
      setErrorMessage("No valid answers found for the selected combination.");
      return;
    }

    setAnswerSet(newAnswerSet);
    setUserInput('');
    setDisplayedAnswers([]);
    setShowAllAnswers(false);
    setSkipButtonLabel('Skip Word');
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsTransitioning(false);
    setShowHint(false);

    // Set the hint to the longest hint in the answerSet
    const longestHint = newAnswerSet.reduce((longest, current) => 
      current.hint && current.hint.length > longest.length ? current.hint : longest
    , '');
    setHint(longestHint);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.slice(-1).toUpperCase();
    
    if (input === ' ') {
      handleNoMoreWords();
      return;
    }

    if (!/^[A-Z]$/.test(input)) {
      return;
    }

    setUserInput(input);

    if (input) {
      const matchingAnswer = answerSet.find(item => item.answer.toUpperCase() === input);
      if (matchingAnswer && !displayedAnswers.some(displayed => displayed.answerWord === matchingAnswer.answerWord)) {
        setDisplayedAnswers(prev => [...prev, matchingAnswer]);
      } else if (!matchingAnswer) {
        const invalidAnswer: WordItem = {
          ...answerSet[0],
          answerWord: answerSet[0].subtopic === 'before' ? input + answerSet[0].root : answerSet[0].root + input,
          definition: 'Not a valid word in this lexicon',
          answer: input
        };
        if (!displayedAnswers.some(displayed => displayed.answerWord === invalidAnswer.answerWord)) {
          setDisplayedAnswers(prev => [...prev, invalidAnswer]);
        }
      }
      setUserInput('');
    }
  };

  const handleNoMoreWords = () => {
    setShowAllAnswers(true);
    const remainingAnswers = answerSet.filter(item => 
      !displayedAnswers.some(displayed => displayed.answerWord === item.answerWord)
    );
    
    setDisplayedAnswers(prev => {
      const newDisplayedAnswers = [...prev, ...remainingAnswers];
      return newDisplayedAnswers.map((item, index) => ({
        ...item,
        isRemaining: index >= prev.length
      }));
    });

    const correctAnswers = answerSet.filter(item => item.answer !== '-' && item.definition);
    const identifiedCorrectAnswers = displayedAnswers.filter(item => 
      item.definition && item.definition !== 'Not a valid word in this lexicon' && item.answer !== '-'
    );
    
    if (answerSet.every(item => item.answer === '-')) {
      setSuccessMessage({
        text: (
          <>
            There are no letters that can go {answerSet[0].subtopic}{' '}
            <span className="root">{answerSet[0].root.toUpperCase()}</span>.
          </>
        ),
        class: 'all-words'
      });
      setDisplayedAnswers([{
        ...answerSet[0],
        answerWord: answerSet[0].root,
        isRemaining: false
      }]);
    } else if (identifiedCorrectAnswers.length === correctAnswers.length) {
      setSuccessMessage({
        text: `You correctly identified all ${correctAnswers.length} words!`,
        class: 'all-words'
      });
    } else {
      setSuccessMessage({
        text: `You identified ${identifiedCorrectAnswers.length} out of ${correctAnswers.length} words`,
        class: 'some-words'
      });
    }

    setSkipButtonLabel('Next Word');
  };

  const handleNextWord = () => {
    setIsTransitioning(true);
    selectNewWord();
    onSkipWord();
    setTimeout(() => setIsTransitioning(false), 300); // Adjust the delay as needed
  };

  const handleShowHint = () => {
    if (hint) {
      setShowHint(true);
    }
    // Refocus the input field after showing the hint
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  if (errorMessage) {
    return <div className="error-message">{errorMessage}</div>;
  }

  if (answerSet.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pure-g">
      <div className="pure-u-1">
        <h2>Challenge: {selectedTopic}</h2>
        {gametype === "AddOne" && (
          <div>
            <p>Which letters go <strong>{answerSet[0].subtopic}</strong> the following word stem?</p>
            <div className="input-area">
              {answerSet[0].subtopic === 'before' && !showAllAnswers && (
                <input
                  type="text"
                  ref={inputRef}
                  value={userInput}
                  onChange={handleInputChange}
                  maxLength={1}
                  className="pure-input-1-6"
                />
              )}
              <span className="root">{answerSet[0].root.toUpperCase()}</span>
              {answerSet[0].subtopic === 'after' && !showAllAnswers && (
                <input
                  type="text"
                  ref={inputRef}
                  value={userInput}
                  onChange={handleInputChange}
                  maxLength={1}
                  className="pure-input-1-6"
                />
              )}
            </div>
            <button 
              className="pure-button" 
              onClick={handleNextWord}
              disabled={isTransitioning}
            >
              {skipButtonLabel}
            </button>
            {!showAllAnswers && (
              <>
                <button 
                  className={`pure-button ${!hint ? 'pure-button-disabled' : ''}`} 
                  onClick={handleShowHint}
                  disabled={!hint}
                >
                  Show Hint
                </button>
                <button className="pure-button" onClick={handleNoMoreWords}>No More Words</button>
              </>
            )}
          </div>
        )}
        {successMessage && (
          <div className={`success-message ${successMessage.class}`}>{successMessage.text}</div>
        )}
        <div className="display-area">
          {showHint && hint && (
            <div className="hint-message">Hint: {hint}</div>
          )}
          {displayedAnswers.filter(item => item.definition).map((item, index) => (
            <div key={index} className={`answer-row ${
              item.definition === 'Not a valid word in this lexicon' ? 'invalid' :
              showAllAnswers && item.isRemaining ? 'missed' : 'valid'
            }`}>
              <span className="answer-word">{item.answerWord.toUpperCase()}</span>
              <span className="definition">{item.definition}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayGame;