/* @layer core @kind logic */
import type { OnlineHost, ReceivedItem } from '../../archipelago';
import { NO_ROOM } from './fake-core.constants';
import type { FakeCore } from './fake-core.type';
import { fakeCoreLink } from './fake-core-link';
import type { FakeCoreHooks } from './fake-core-hooks.type';
import { hashText } from './hash-text';

const keyOfId = (id: number): string => `check-${String(id).padStart(3, '0')}`;
const idOfKey = (key: string): number => Number(key.replace(/^check-0*/, ''));

const deliverTo = (core: FakeCore, hooks: FakeCoreHooks, item: ReceivedItem): ReturnType<OnlineHost['deliver']> => {
  const { port } = core;
  const epoch = port?.epoch() ?? 0;
  const sender = hooks.isFromServer(item) ? null : item.senderName;
  return core.deliver(item.itemName, sender, () => { port?.settle(item.index, epoch); });
};

const fakeCoreHost = (core: FakeCore, hooks: FakeCoreHooks): OnlineHost => {
  const link = fakeCoreLink(() => core, hooks);
  core.die = link.die;
  return {
    arm: () => undefined,
    disarm: () => { core.disarms += 1; },
    armScouted: () => core.armedLocations,
    deliver: (item) => deliverTo(core, hooks, item),
    cancelDeliveries: () => core.cancelDeliveries(),
    onDeliveryReady: (listener) => {
      core.readyListeners.add(listener);
      return () => core.readyListeners.delete(listener);
    },
    isFileInPlay: () => core.isFileInPlay(),
    onSaveSwap: (listener) => core.onSaveSwap(listener),
    goalReached: () => core.goal,
    startPolling: () => {
      for (const key of core.localComplete) if (!core.collected.has(key)) core.report?.(idOfKey(key));
    },
    pausePolling: () => { core.pauses += 1; },
    readCursor: () => ({ index: core.readReceivedIndex(), roomHash: hashText(core.readRoomHash()) }),
    writeCursor: ({ index, roomHash }) => {
      const hash = roomHash === '' ? NO_ROOM : Number(roomHash);
      if (hash !== core.readRoomHash()) core.writeRoomHash(hash);
      if (index !== core.readReceivedIndex()) core.writeReceivedIndex(index);
    },
    markCollected: (ids) => { for (const id of ids) core.collected.add(keyOfId(id)); },
    setDeathLink: (on) => { core.deathLinkBits.push(on); },
    killLink: link.killLink,
    onLinkDied: link.onLinkDied,
  };
};

export { fakeCoreHost };
