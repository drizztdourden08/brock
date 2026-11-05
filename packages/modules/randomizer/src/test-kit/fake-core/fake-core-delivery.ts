/* @layer core @kind logic */
import type { FakeCore } from './fake-core.type';
import type { FakeCoreDelivery } from './fake-core-delivery.type';

const fakeCoreDelivery = (self: () => FakeCore): FakeCoreDelivery => ({
  deliver: (itemName, sender, onGranted) => {
    const core = self();
    if (core.notReady.has(itemName)) return 'not-ready';
    const grant = (): void => {
      core.delivered.push({ itemName, sender });
      onGranted();
    };
    if (core.holdGrants) core.queued.push({ itemName, sender, grant });
    else grant();
    return 'delivered';
  },
  cancelDeliveries: () => {
    self().cancels += 1;
    self().queued = [];
  },
  grantNext: () => self().queued.shift()?.grant(),
  becomeReady: () => {
    const core = self();
    core.notReady.clear();
    const listeners = [...core.readyListeners];
    core.readyListeners.clear();
    for (const listener of listeners) listener();
  },
});

export { fakeCoreDelivery };
