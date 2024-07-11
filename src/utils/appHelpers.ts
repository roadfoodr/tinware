// Generated on 2024-07-10 at 21:00 PM EDT

import { WordItem } from '../db';
import { getFromIndexedDB, clearCache } from '../services/DataInitializer';
import { db } from '../db';

export const fetchTopics = async (): Promise<string[]> => {
  const allData = await getFromIndexedDB();
  if (allData.length > 0) {
    const allTopics = Array.from(new Set(allData.map(item => item.topic)));
    return ['All Words', ...allTopics];
  }
  return [];
};

export const selectTopic = async (topic: string): Promise<{
  filteredData: WordItem[];
  selectedGameType: string | null;
}> => {
  let filteredData: WordItem[];
  if (topic === 'All Words') {
    filteredData = await db.wordList.toArray();
  } else {
    filteredData = await db.wordList.where('topic').equals(topic).toArray();
  }
  
  const selectedGameType = filteredData.length > 0 ? filteredData[0].gametype : null;
  
  return { filteredData, selectedGameType };
};

export const restartGame = () => ({
  selectedTopic: null,
  selectedGameType: null,
  gameData: [],
});

export const clearAppCache = async () => {
  await clearCache();
  return {
    dataLoaded: false,
    topics: [],
    selectedTopic: null,
    selectedGameType: null,
    gameData: [],
  };
};