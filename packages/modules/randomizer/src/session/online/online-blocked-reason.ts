/* @layer core @kind logic */
import type { RandomizerProfileConfig } from '../../augment';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { ArchipelagoGame } from '../../contract/archipelago-game.type';
import { onlineConnectionOf } from './online-connection-of';
import { NO_SERVER } from './online-session.constants';

const onlineBlockedReason = <P, A>(ap: ArchipelagoGame<P, A>, config: RandomizerProfileConfig): Text | null =>
  ap.allows?.() ?? (onlineConnectionOf(config) === null ? NO_SERVER : null);

export { onlineBlockedReason };
