/* @layer renderer-shell @kind logic */
import type { RandomizerSession } from '../../../../session';
import type { SpeakingSession } from './room-speaker.type';

const canSay = (session: RandomizerSession | null): session is SpeakingSession =>
  session !== null && typeof (session as Partial<SpeakingSession>).say === 'function';

export { canSay };
