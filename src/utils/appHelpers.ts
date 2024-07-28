// Generated on 2024-07-28 at 18:00 PM EDT

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
    answerWord: String(item.answerWord),
    definition: String(item.definition),
    scenarioID: String(item.scenarioID)
  }));

  const selectedGameType = filteredData.length > 0 ? filteredData[0].gametype : null;
  
  // Get unique scenario IDs
  const scenarios = Array.from(new Set(filteredData.map(item => item.scenarioID)));

  return { filteredData, selectedGameType, scenarios };
};

export const restartGame = () => ({
  selectedTopic: null,
  selectedGameType: null,
  gameData: [],
  currentScenarioID: null,
});

export const clearAppCache = async () => {
  await clearCache();
  return {
    dataLoaded: false,
    topics: [],
    selectedTopic: null,
    selectedGameType: null,
    gameData: [],
    currentScenarioID: null,
  };
};

export const getScenarioData = (data: WordItem[], scenarioID: string): WordItem[] => {
  return data.filter(item => item.scenarioID === scenarioID);
};

export const getRandomScenario = (scenarios: string[]): string | null => {
  if (scenarios.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * scenarios.length);
  return scenarios[randomIndex];
};