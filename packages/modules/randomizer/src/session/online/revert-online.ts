/* @layer core @kind logic */
import { ONLINE_TAG } from './online-session.constants';
import type { OnlineParts } from './online-parts.type';

const revertOnline = async <P, A>({ game, log }: OnlineParts<P, A>): Promise<void> => {
  try {
    await game.applier.revert();
  } catch (error) {
    log(`${ONLINE_TAG} Revert failed: ${error instanceof Error ? error.message : String(error)}`, 'error');
  }
};

export { revertOnline };
