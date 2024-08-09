// Generated on 2024-07-28 at 14:30 PM EDT

import Dexie, { Table } from 'dexie';

export interface WordItem {
  id: number;
  taskID: string;
  scenarioID: string;
  topic: string;
  gametype: string;
  subtopic: string;
  root: string;
  answer: string;
  answerWord: string;
  hint: string;
  definition: string;
  canAddS: boolean;
}

export class TinwareDatabase extends Dexie {
  wordList!: Table<WordItem, number>;

  constructor() {
    super('TinwareDB');
    this.version(2).stores({
      wordList: '++id, taskID, scenarioID, topic, gametype, subtopic, root, answer, answerWord, hint, definition, canAddS'
    });
  }
}

export const db = new TinwareDatabase();