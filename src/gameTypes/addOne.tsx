import { GameTypeDefinition, GameInputRenderProps, GamePromptRenderProps } from './types';

const renderPrompt = ({ scenario, selectedTopic }: GamePromptRenderProps) => (
  <div className="game-prompt">
    <h2>Challenge: {selectedTopic}</h2>
    <p>
      Which letters go <strong>{scenario.subtopic}</strong> the word stem?
    </p>
  </div>
);

const renderInput = ({
  inputRef,
  value,
  onChange,
  onKeyDown,
  disabled,
  scenario,
}: GameInputRenderProps) => {
  const input = (
    <input
      type="text"
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      maxLength={1}
      className="pure-input-1-6 root"
      aria-label={`Enter letter ${scenario.subtopic} the root`}
      disabled={disabled}
    />
  );

  return (
    <div className="input-area">
      {scenario.subtopic === 'before' && input}
      <span className="root">{scenario.root.toUpperCase()}</span>
      {scenario.subtopic === 'after' && input}
    </div>
  );
};

export const addOneDefinition: GameTypeDefinition = {
  key: 'AddOne',

  inputConfig: {
    maxLength: 1,
    requiresExplicitSubmit: false,
  },

  filterInput: (input: string) => input.replace(/[^A-Za-z]/g, '').slice(0, 1).toUpperCase(),

  shouldAutoSubmit: (input: string) => /^[A-Z]$/.test(input),

  renderPrompt,

  renderInput,

  matchAnswer: (input, answer) => answer.answer.toUpperCase() === input.toUpperCase(),

  buildAnswerWord: (input, scenario) => {
    const upperInput = input.toUpperCase();
    return scenario.subtopic === 'before'
      ? upperInput + scenario.root.toUpperCase()
      : scenario.root.toUpperCase() + upperInput;
  },
};
