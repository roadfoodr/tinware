// Generated on 2024-08-01 at 10:30 AM EDT

import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import { DataInitializer } from './services/DataInitializer';
import SelectGame from './components/SelectGame';
import PlayGame from './components/PlayGame/PlayGame';
import { WordItem } from './db';
import { fetchTopics, selectTopic, restartGame, clearAppCache } from './utils/appHelpers';
import { GameType } from './types/gameTypes';

const App: React.FC = () => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [gameData, setGameData] = useState<WordItem[]>([]);
  const [currentGameType, setCurrentGameType] = useState<GameType>('AddOne');

  useEffect(() => {
    if (dataLoaded) {
      fetchTopics().then(setTopics);
    }
  }, [dataLoaded]);

  const handleSelectTopic = async (topic: string) => {
    setSelectedTopic(topic);
    const { filteredData } = await selectTopic(topic);
    setGameData(filteredData);
    // Set an initial game type, this will be updated in PlayGame component
    setCurrentGameType(filteredData[0]?.gametype as GameType || 'AddOne');
  };

  const handleRestart = () => {
    const { selectedTopic, gameData } = restartGame();
    setSelectedTopic(selectedTopic);
    setGameData(gameData);
    setCurrentGameType('AddOne');
  };

  const handleClearCache = async () => {
    const { dataLoaded, topics, selectedTopic, gameData } = await clearAppCache();
    setDataLoaded(dataLoaded);
    setTopics(topics);
    setSelectedTopic(selectedTopic);
    setGameData(gameData);
    setCurrentGameType('AddOne');
  };

  const handleGameTypeChange = (newGameType: GameType) => {
    setCurrentGameType(newGameType);
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
        {dataLoaded && selectedTopic && gameData.length > 0 && (
          <PlayGame
            data={gameData}
            gametype={currentGameType}
            onSkipWord={() => {}} // This is now handled internally by PlayGame
            selectedTopic={selectedTopic}
            onGameTypeChange={handleGameTypeChange}
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