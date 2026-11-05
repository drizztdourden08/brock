/* @layer core @kind types */
import type { RandomizerProfileConfig } from '../augment';

interface RollJoined {
  kind: 'joined';
  result: unknown;
}

type RollOutcome<P> = P | RollJoined;

interface JoinedContext {
  profileId: string;
  config: RandomizerProfileConfig;
}

export type { JoinedContext, RollJoined, RollOutcome };
