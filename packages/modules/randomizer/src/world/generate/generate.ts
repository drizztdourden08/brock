/* @layer core @kind logic */
import { FillError } from '../fill/fill-error';
import { MAX_PLACEMENT_ATTEMPTS } from '../fill/fill.constants';
import { runAttempt } from './run-attempt';
import type { RandomizerWorldGame, WorldGameTypes } from '../types';

const generate = <T extends WorldGameTypes>(
  game: RandomizerWorldGame<T>, request: T['request'],
): T['placement'] => {
  const limit = game.maxAttempts ?? MAX_PLACEMENT_ATTEMPTS;
  const prep = (game.prepare ? game.prepare(request) : undefined) as T['prep'];
  let lastMessage = '';
  for (let attempt = 0; attempt < limit; attempt += 1) {
    try {
      return runAttempt(game, request, prep, attempt);
    } catch (error) {
      if (!(error instanceof FillError)) throw error;
      lastMessage = error.message;
    }
  }
  throw new Error(`generation failed for seed "${request.seed}" after ${limit} attempts, last: ${lastMessage}`);
};

export { generate };
