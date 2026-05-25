import { GameTypeDefinition } from './types';
import { addOneDefinition } from './addOne';
import { bingoStemDefinition } from './bingoStem';

const gameTypeMap = new Map<string, GameTypeDefinition>();

function register(definition: GameTypeDefinition) {
  if (gameTypeMap.has(definition.key)) {
    console.warn(`GameType "${definition.key}" is already registered. Overwriting.`);
  }
  gameTypeMap.set(definition.key, definition);
}

// Register built-in game types.
register(addOneDefinition);
register(bingoStemDefinition);

/**
 * Look up a game type definition by key.
 * Throws if the key is not registered. This is a programming error.
 */
export function getGameType(key: string): GameTypeDefinition {
  const def = gameTypeMap.get(key);
  if (!def) {
    throw new Error(`Unknown game type: "${key}". Did you forget to register it?`);
  }
  return def;
}

export function isGameTypeRegistered(key: string): boolean {
  return gameTypeMap.has(key);
}

/**
 * Register a new game type at runtime.
 * Use this to add game types from outside the core module.
 */
export { register as registerGameType };
