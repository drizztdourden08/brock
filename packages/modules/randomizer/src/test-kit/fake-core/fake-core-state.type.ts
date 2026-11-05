/* @layer core @kind types */
import type { FakeCore } from './fake-core.type';

type FakeCoreState = Pick<FakeCore,
  | 'port' | 'report' | 'delivered' | 'queued' | 'holdGrants' | 'index' | 'roomHash' | 'inPlay' | 'goal' | 'kills'
  | 'down' | 'disarms' | 'pauses' | 'cancels' | 'deathLinkBits' | 'collected' | 'localComplete' | 'armedLocations'
  | 'notReady' | 'readyListeners'>;

export type { FakeCoreState };
