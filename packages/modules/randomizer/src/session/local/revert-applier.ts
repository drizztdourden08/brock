/* @layer core @kind logic */
import type { RandomizerGame } from '../../contract/randomizer-game.type';
import type { RandomizerLog } from '../../contract/randomizer-log.type';
import { LOCAL_TAG } from './local-session.constants';

const revertApplier = async <P, A>(game: RandomizerGame<P, A>, log: RandomizerLog): Promise<void> => {
  try {
    await game.applier.revert();
  } catch (error) {
    log(`${LOCAL_TAG} Revert failed: ${error instanceof Error ? error.message : String(error)}`, 'error');
  }
};

export { revertApplier };
