import React, { useState, useEffect, useCallback } from 'react';
import NavBar from './components/NavBar';
import { DataInitializer } from './services/DataInitializer';
import SelectGame from './components/SelectGame';
import PlayGame from './components/PlayGame/PlayGame';
import { WordItem } from './db';
import { fetchTopics, selectTopic, restartGame, clearAppCache, getRandomScenario } from './utils/appHelpers';
import { GameType } from './types/gameTypes';
import { GameProvider } from './context/GameContext';

const App: React.FC = () => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [gameData, setGameData] = useState<WordItem[]>([]);
  const [currentGameType, setCurrentGameType] = useState<GameType>('AddOne');
  const [allTopicData, setAllTopicData] = useState<WordItem[]>([]);
  const [scenarios, setScenarios] = useState<string[]>([]);

  useEffect(() => {
    if (dataLoaded) {
      fetchTopics().then(setTopics);
    }
  }, [dataLoaded]);

  const selectNewScenario = useCallback((scenarioList: string[], topicData: WordItem[]) => {
    console.log('Selecting new scenario. Available scenarios:', scenarioList);
    const randomScenarioId = getRandomScenario(scenarioList);
    console.log('Selected scenario ID:', randomScenarioId);
    if (randomScenarioId) {
      const scenarioData = topicData.filter(item => item.scenarioID === randomScenarioId);
      console.log('Filtered scenario data:', scenarioData);
      setGameData(scenarioData);
      setCurrentGameType(scenarioData[0]?.gametype as GameType || 'AddOne');
    } else {
      console.log('No scenario selected. Clearing game data.');
      setGameData([]);
      setCurrentGameType('AddOne');
    }
  }, []);

  const handleSelectTopic = async (topic: string) => {
    console.log('Selected topic:', topic);
    setSelectedTopic(topic);
    const { filteredData, scenarios: newScenarios } = await selectTopic(topic);
    console.log('Filtered data:', filteredData);
    console.log('New scenarios:', newScenarios);
    setAllTopicData(filteredData);
    setScenarios(newScenarios);
    selectNewScenario(newScenarios, filteredData);
  };

  const handleSkipWord = useCallback(() => {
    console.log('Skipping word');
    selectNewScenario(scenarios, allTopicData);
  }, [scenarios, allTopicData, selectNewScenario]);

  const handleRestart = () => {
    const { selectedTopic, gameData } = restartGame();
    setSelectedTopic(selectedTopic);
    setGameData(gameData);
    setCurrentGameType('AddOne');
    setAllTopicData([]);
    setScenarios([]);
  };

  const handleClearCache = async () => {
    const { dataLoaded, topics, selectedTopic, gameData } = await clearAppCache();
    setDataLoaded(dataLoaded);
    setTopics(topics);
    setSelectedTopic(selectedTopic);
    setGameData(gameData);
    setCurrentGameType('AddOne');
    setAllTopicData([]);
    setScenarios([]);
  };

  return (
    <GameProvider>
      <div className="pure-u-1">
        <NavBar onRestart={handleRestart} onClearCache={handleClearCache} />
      </div>
      <div className="pure-g">
        <div className="pure-u-1">
          <DataInitializer onDataLoaded={() => setDataLoaded(true)} />
          {dataLoaded && !selectedTopic && (
            <SelectGame topics={topics} onSelectTopic={handleSelectTopic} />
          )}
          {dataLoaded && selectedTopic && gameData.length > 0 && (
            <PlayGame
              data={gameData}
              gametype={currentGameType}
              onSkipWord={handleSkipWord}
              selectedTopic={selectedTopic}
              onGameTypeChange={setCurrentGameType}
            />
          )}
          {dataLoaded && selectedTopic && gameData.length === 0 && (
            <div>No data available for the selected topic. (Topic: {selectedTopic}, All topic data: {allTopicData.length}, Scenarios: {scenarios.length})</div>
          )}
        </div>
      </div>
      </GameProvider>
  );
};

export default App;