// Generated on 2024-07-29 at 13:15 PM EDT

import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import { DataInitializer } from './services/DataInitializer';
import SelectGame from './components/SelectGame';
import PlayGame from './components/PlayGame/PlayGame';
import { WordItem } from './db';
import { fetchTopics, selectTopic, restartGame, clearAppCache } from './utils/appHelpers';

const App: React.FC = () => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedGameType, setSelectedGameType] = useState<string | null>(null);
  const [gameData, setGameData] = useState<WordItem[]>([]);

  useEffect(() => {
    if (dataLoaded) {
      fetchTopics().then(setTopics);
    }
  }, [dataLoaded]);

  const handleSelectTopic = async (topic: string) => {
    setSelectedTopic(topic);
    const { filteredData, selectedGameType } = await selectTopic(topic);
    setSelectedGameType(selectedGameType);
    setGameData(filteredData);
  };

  const handleRestart = () => {
    const { selectedTopic, selectedGameType, gameData } = restartGame();
    setSelectedTopic(selectedTopic);
    setSelectedGameType(selectedGameType);
    setGameData(gameData);
  };

  const handleClearCache = async () => {
    const { dataLoaded, topics, selectedTopic, selectedGameType, gameData } = await clearAppCache();
    setDataLoaded(dataLoaded);
    setTopics(topics);
    setSelectedTopic(selectedTopic);
    setSelectedGameType(selectedGameType);
    setGameData(gameData);
  };

  return (
    <div className="pure-g">
      <div className="pure-u-1">
        <NavBar onRestart={handleRestart} onClearCache={handleClearCache} />
      </div>
      <div className="pure-u-1" style={{ marginTop: '50px' }}>
        <DataInitializer onDataLoaded={() => setDataLoaded(true)} />
        {dataLoaded && !selectedTopic && (
          <SelectGame topics={topics} onSelectTopic={handleSelectTopic} />
        )}
        {dataLoaded && selectedTopic && selectedGameType && gameData.length > 0 && (
          <PlayGame
            data={gameData}
            gametype={selectedGameType}
            onSkipWord={() => {}} // This is now handled internally by PlayGame
            selectedTopic={selectedTopic}
          />
        )}
        {dataLoaded && selectedTopic && gameData.length === 0 && (
          <div>No data available for the selected topic.</div>
        )}
      </div>
    </div>
  );
};

export default App;