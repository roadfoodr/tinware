// Generated on 2024-07-08 at 13:45 PM EDT

import Dexie, { Table } from 'dexie';

export interface WordItem {
  id?: number;
  taskID: string;
  topic: string;
  gametype: string;
  subtopic: string;
  root: string;
  answer: string;
  answerWord: string;
  hint: string;
  definition: string;
  canAddS: string;
}

export class TinwareDatabase extends Dexie {
  wordList!: Table<WordItem, number>;

  constructor() {
    super('TinwareDB');
    this.version(1).stores({
      wordList: '++id, taskID, topic, gametype, subtopic, root, answer, answerWord, hint, definition, canAddS'
    });
  }
}

export const db = new TinwareDatabase();