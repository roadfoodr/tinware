// Generated on 2024-07-09 at 15:55 PM EDT

import React, { useState, useEffect, useRef } from 'react';
import { WordItem } from '../db';

interface PlayGameProps {
  data: WordItem[];
  gametype: string;
  onSkipWord: () => void;
  selectedTopic: string;
}

const PlayGame: React.FC<PlayGameProps> = ({ data, gametype, onSkipWord, selectedTopic }) => {
  const [answerSet, setAnswerSet] = useState<WordItem[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [displayedAnswers, setDisplayedAnswers] = useState<WordItem[]>([]);
  const [showAllAnswers, setShowAllAnswers] = useState<boolean>(false);
  const [skipButtonLabel, setSkipButtonLabel] = useState<string>('Skip Word');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    selectNewWord();
  }, [data]);

  useEffect(() => {
    if (inputRef.current && !showAllAnswers) {
      inputRef.current.focus();
    }
  }, [answerSet, showAllAnswers]);

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
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.slice(-1).toUpperCase();
    setUserInput(input);

    if (input) {
      const matchingAnswer = answerSet.find(item => item.answer.toUpperCase() === input);
      if (matchingAnswer && !displayedAnswers.some(displayed => displayed.answerWord === matchingAnswer.answerWord)) {
        setDisplayedAnswers(prev => [...prev, matchingAnswer]);
      } else if (!matchingAnswer) {
        const invalidAnswer: WordItem = {
          ...answerSet[0],
          answerWord: answerSet[0].subtopic === 'before' ? input + answerSet[0].root : answerSet[0].root + input,
          definition: 'Not a valid Scrabble word',
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

    const invalidAnswers = displayedAnswers.filter(item => item.definition === 'Not a valid Scrabble word');
    
    if (answerSet.every(item => item.answer === '-')) {
      setSuccessMessage(
        <>
          There are no letters that can go {answerSet[0].subtopic}{' '}
          <span className="root">{answerSet[0].root.toUpperCase()}</span>.
        </>
      );
      setDisplayedAnswers([{
        ...answerSet[0],
        answerWord: answerSet[0].root,
        isRemaining: false
      }]);
    } else if (remainingAnswers.length === 0 && invalidAnswers.length === 0) {
      setSuccessMessage("You correctly identified all the words!");
    }

    setSkipButtonLabel('Next word');
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
            <p>Which letters go {answerSet[0].subtopic} the following word stem?</p>
            <div className="input-area">
              {answerSet[0].subtopic === 'before' && !showAllAnswers && (
                <input
                  type="text"
                  ref={inputRef}
                  value={userInput}
                  onChange={handleInputChange}
                  maxLength={1}
                  className="pure-input-1-4"
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
                  className="pure-input-1-4"
                />
              )}
            </div>
            {!showAllAnswers && (
              <button className="pure-button" onClick={handleNoMoreWords}>No More Words</button>
            )}
            <button className="pure-button" onClick={() => {
              selectNewWord();
              onSkipWord();
            }}>{skipButtonLabel}</button>
          </div>
        )}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        <div className="display-area">
          {displayedAnswers.map((item, index) => (
            <div key={index} className={`answer-row ${
              item.definition === 'Not a valid Scrabble word' ? 'invalid' :
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