/* @layer core @kind logic */
import { defaultFakeCoreHooks } from './default-fake-core-hooks';
import type { FakeCore } from './fake-core.type';
import { fakeCoreDelivery } from './fake-core-delivery';
import { fakeCoreHost } from './fake-core-host';
import type { FakeCoreHooks } from './fake-core-hooks.type';
import { fakeCorePlay } from './fake-core-play';
import { fakeCoreState } from './fake-core-state';

const createFakeCore = (hooks: FakeCoreHooks = defaultFakeCoreHooks): FakeCore => {
  const self = (): FakeCore => core;
  const core = { ...fakeCoreState(), ...fakeCoreDelivery(self), ...fakeCorePlay(self) } as FakeCore;
  core.host = fakeCoreHost(core, hooks);
  return core;
};

export { createFakeCore };
