/* @layer core @kind logic */
import type { RandomizerProfileConfig } from '../../augment';
import type { ArchipelagoGame } from '../../contract/archipelago-game.type';
import { onlineConnectionOf } from './online-connection-of';

const NO_SERVER_REASON = 'No server address is set for this profile';

const onlineBlockedReason = <P, A>(ap: ArchipelagoGame<P, A>, config: RandomizerProfileConfig): string | null =>
  ap.allows?.() ?? (onlineConnectionOf(config) === null ? NO_SERVER_REASON : null);

export { onlineBlockedReason };
