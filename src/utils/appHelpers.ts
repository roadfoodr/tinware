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
  scenarios: string[];
}> => {
  let filteredData: WordItem[];
  if (topic === 'All Words') {
    filteredData = await db.wordList.toArray();
  } else {
    filteredData = await db.wordList.where('topic').equals(topic).toArray();
  }
  
  // Ensure all string comparisons are done safely
  filteredData = filteredData.map(item => ({
    ...item,
    answerWord: String(item.answerWord || ''),
    definition: String(item.definition || ''),
    scenarioID: String(item.scenarioID || '')
  }));

  // Get unique scenario IDs
  const scenarios = Array.from(new Set(filteredData.map(item => item.scenarioID)));

  return { filteredData, scenarios };
};

export const restartGame = () => ({
  selectedTopic: null,
  gameData: [],
});

export const clearAppCache = async () => {
  await clearCache();
  return {
    dataLoaded: false,
    topics: [],
    selectedTopic: null,
    gameData: [],
  };
};

export const getRandomScenario = (scenarios: string[]): string | null => {
  if (scenarios.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * scenarios.length);
  return scenarios[randomIndex];
};