/* @layer core @kind logic */
import type { RandomizerProfileConfig } from '../../augment';
import type { ArchipelagoGame } from '../../contract/archipelago-game.type';
import { onlineConnectionOf } from './online-connection-of';
import { NO_SERVER } from './online-session.constants';

const onlineBlockedReason = <P, A>(ap: ArchipelagoGame<P, A>, config: RandomizerProfileConfig): string | null =>
  ap.allows?.() ?? (onlineConnectionOf(config) === null ? NO_SERVER : null);

export { onlineBlockedReason };
