/* @layer core @kind logic */
import type { DefPlacement } from '../world';
import { REQUIRED_GAME_FIELDS } from './randomizer-game.constants';
import type { RandomizerGame } from './randomizer-game.type';

const defineRandomizerGame = <P = DefPlacement, A = unknown>(
  game: RandomizerGame<P, A>,
): RandomizerGame<P, A> => {
  for (const field of REQUIRED_GAME_FIELDS) {
    const value: unknown = game[field];
    if (value === undefined || value === null) {
      throw new Error(`defineRandomizerGame: missing required field "${field}"`);
    }
  }
  if (typeof game.profile.toConfig !== 'function') {
    throw new Error('defineRandomizerGame: missing required field "profile.toConfig"');
  }
  return game;
};

export { defineRandomizerGame };
