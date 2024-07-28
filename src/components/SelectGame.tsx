// Generated on 2024-07-29 at 10:00 AM EDT

import React from 'react';

interface SelectGameProps {
  topics: string[];
  onSelectTopic: (topic: string) => void;
}

const SelectGame: React.FC<SelectGameProps> = ({ topics, onSelectTopic }) => {
  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTopic = e.target.value;
    if (selectedTopic) {
      onSelectTopic(selectedTopic);
    }
  };

  return (
    <div className="pure-g">
      <div className="pure-u-1 pure-u-md-1-3">
        <select 
          className="pure-input-1" 
          onChange={handleTopicChange}
          defaultValue=""
        >
          <option value="" disabled>Select a challenge</option>
          {topics.map((topic, index) => (
            <option key={index} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectGame;