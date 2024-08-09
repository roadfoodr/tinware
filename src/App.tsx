import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import { DataInitializer } from './services/DataInitializer';
import SelectGame from './components/SelectGame';
import PlayGame from './components/PlayGame/PlayGame';
import { fetchTopics, restartGame, clearAppCache } from './utils/appHelpers';
import { GameProvider } from './context/GameContext';
import { AppSettingsProvider } from './context/AppSettingsContext';
import { useGameManager } from './hooks/useGameManager';

const App: React.FC = () => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const {
    allTopicData,
    scenarios,
    currentGameType,
    gameData,
    handleSelectTopic,
    handleSkipWord
  } = useGameManager();

  useEffect(() => {
    if (dataLoaded) {
      fetchTopics().then(setTopics);
    }
  }, [dataLoaded]);

  const handleRestart = () => {
    const { selectedTopic, gameData } = restartGame();
    setSelectedTopic(selectedTopic);
  };

  const handleClearCache = async () => {
    const { dataLoaded, topics, selectedTopic, gameData } = await clearAppCache();
    setDataLoaded(dataLoaded);
    setTopics(topics);
    setSelectedTopic(selectedTopic);
  };

  return (
    <AppSettingsProvider>
      <GameProvider>
        <div className="pure-u-1">
          <NavBar onRestart={handleRestart} onClearCache={handleClearCache} />
        </div>
        <div className="pure-g">
          <div className="pure-u-1">
            <DataInitializer onDataLoaded={() => setDataLoaded(true)} />
            {dataLoaded && !selectedTopic && (
              <SelectGame topics={topics} onSelectTopic={(topic) => {
                setSelectedTopic(topic);
                handleSelectTopic(topic);
              }} />
            )}
            {dataLoaded && selectedTopic && gameData.length > 0 && (
              <PlayGame
                data={gameData}
                gametype={currentGameType}
                onSkipWord={handleSkipWord}
                selectedTopic={selectedTopic}
              />
            )}
            {dataLoaded && selectedTopic && gameData.length === 0 && (
              <div>No data available for the selected topic. (Topic: {selectedTopic}, All topic data: {allTopicData.length}, Scenarios: {scenarios.length})</div>
            )}
          </div>
        </div>
      </GameProvider>
    </AppSettingsProvider>
  );
};

export default App;