// Generated on 2024-07-08 at 14:50 PM EDT

import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import { DataInitializer, getFromIndexedDB, clearCache } from './services/DataInitializer';
import SelectGame from './components/SelectGame';
import PlayGame from './components/PlayGame';
import { db, WordItem } from './db';

const App: React.FC = () => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [gameData, setGameData] = useState<WordItem[]>([]);

  useEffect(() => {
    if (dataLoaded) {
      fetchTopics();
    }
  }, [dataLoaded]);

  const fetchTopics = async () => {
    const allData = await getFromIndexedDB();
    if (allData.length > 0) {
      const allTopics = Array.from(new Set(allData.map(item => item.topic)));
      setTopics(['All Words', ...allTopics]);
    }
  };

  const handleSelectTopic = async (topic: string) => {
    setSelectedTopic(topic);
    let filteredData: WordItem[];
    if (topic === 'All Words') {
      filteredData = await db.wordList.limit(10).toArray();
    } else {
      filteredData = await db.wordList.where('topic').equals(topic).limit(10).toArray();
    }
    setGameData(filteredData);
  };

  const handleRestart = () => {
    setSelectedTopic(null);
    setGameData([]);
  };

  const handleClearCache = async () => {
    await clearCache();
    setDataLoaded(false);
    setTopics([]);
    setSelectedTopic(null);
    setGameData([]);
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
          <PlayGame data={gameData} />
        )}
        {dataLoaded && selectedTopic && gameData.length === 0 && (
          <div>No data available for the selected topic.</div>
        )}
      </div>
    </div>
  );
};

export default App;