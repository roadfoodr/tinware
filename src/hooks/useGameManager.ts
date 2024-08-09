import { useState, useCallback } from 'react';
import { WordItem } from '../db';
import { GameType } from '../types/gameTypes';
import { selectTopic } from '../utils/appHelpers';
import { getRandomScenario, processScenarioData } from '../utils/GameUtils';

export const useGameManager = () => {
  const [allTopicData, setAllTopicData] = useState<WordItem[]>([]);
  const [scenarios, setScenarios] = useState<string[]>([]);
  const [currentGameType, setCurrentGameType] = useState<GameType>('AddOne');
  const [gameData, setGameData] = useState<WordItem[]>([]);
  const [previousScenarioId, setPreviousScenarioId] = useState<string | null>(null);

  const handleSelectTopic = useCallback(async (topic: string) => {
    const { filteredData, scenarios: newScenarios } = await selectTopic(topic);
    setAllTopicData(filteredData);
    setScenarios(newScenarios);
    setPreviousScenarioId(null); // Reset previous scenario when selecting a new topic
    selectNewScenario(newScenarios, filteredData, null);
  }, []);

  const selectNewScenario = useCallback((scenarioList: string[], topicData: WordItem[], prevScenarioId: string | null) => {
    const randomScenarioId = getRandomScenario(scenarioList, prevScenarioId);
    if (randomScenarioId) {
      const scenarioData = topicData.filter(item => item.scenarioID === randomScenarioId);
      const processedData = processScenarioData(scenarioData);
      setGameData(processedData);
      setCurrentGameType(processedData[0]?.gametype as GameType || 'AddOne');
      setPreviousScenarioId(randomScenarioId);
    } else {
      setGameData([]);
      setCurrentGameType('AddOne');
      setPreviousScenarioId(null);
    }
  }, []);

  const handleSkipWord = useCallback(() => {
    selectNewScenario(scenarios, allTopicData, previousScenarioId);
  }, [scenarios, allTopicData, selectNewScenario, previousScenarioId]);

  return {
    allTopicData,
    scenarios,
    currentGameType,
    gameData,
    handleSelectTopic,
    handleSkipWord,
    setCurrentGameType
  };
};