/* @layer core @kind types */
import type { ClientDeps, CreateSocket } from '../../archipelago';
import type { FakeCore } from '../fake-core';

type HarnessAdapter = Pick<ClientDeps, 'game' | 'slot' | 'locationKeyOf' | 'order' | 'log'>;

interface HarnessDeps {
  core: FakeCore;
  createSocket: CreateSocket;
  adapter: HarnessAdapter;
}

export type { HarnessAdapter, HarnessDeps };
