/* @layer core @kind types */
import type { RandomizerLog } from '../../contract/randomizer-log.type';
import type { MemoryView } from '../../memory/memory-view.type';
import type { PollerHooks } from './location-poller.type';
import type { PollerState } from './poller-state.type';

interface PollPass {
  state: PollerState;
  hooks: PollerHooks;
  view: MemoryView;
  completed: ReadonlySet<string>;
  log: RandomizerLog;
}

export type { PollPass };
