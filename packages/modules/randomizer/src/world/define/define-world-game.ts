/* @layer core @kind logic */
import { MAIN_FILL } from '../fill/main-fill.constants';
import type { RandomizerWorldGame, WorldGameTypes } from '../types';

const defineWorldGame = <T extends WorldGameTypes>(
  game: RandomizerWorldGame<T>,
): RandomizerWorldGame<T> => {
  const mains = game.fillPhases.filter((phase) => phase.id === MAIN_FILL.id).length;
  if (mains !== 1) {
    throw new Error(`${game.game}: fillPhases must contain "${MAIN_FILL.id}" once, found ${mains}`);
  }
  return game;
};

export { defineWorldGame };
