/* @layer renderer-shell @kind logic */
import type { RandomizerGame } from '../../contract/randomizer-game.type';
import type { RandomizerLog } from '../../contract/randomizer-log.type';
import type { RandomizerProfileConfig } from '../../augment';
import { resolveLogText } from '../boot/resolve-log-text';
import { writePlacement } from '../placement/write-placement';

const rerollPlacement = async <P, A>(
  game: RandomizerGame<P, A>,
  profileId: string,
  config: RandomizerProfileConfig,
  log: RandomizerLog,
): Promise<P | null> => {
  try {
    const placement = await game.roll(config, { profileId });
    await writePlacement(game, profileId, placement);
    log(`[Boot] Placement file unreadable by this build; rolled seed ${config.seed} again`, 'warn');
    return placement;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log(resolveLogText(game.logText).rerollFailed(message), 'error');
    return null;
  }
};

export { rerollPlacement };
