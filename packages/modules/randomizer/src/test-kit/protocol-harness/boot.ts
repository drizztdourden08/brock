/* @layer core @kind logic */
import { createFakeCore } from '../fake-core';
import { createFakeServer } from '../fake-server';
import type { FakeRoom } from '../fake-server';
import { createOnlineClient } from './create-online-client';
import type { HarnessAdapter } from './harness-adapter.type';
import type { HarnessConfig } from './harness-session.type';
import { settle } from './settle';

const boot = async (room: FakeRoom, adapter: HarnessAdapter, extra: Partial<HarnessConfig> = {}) => {
  const server = createFakeServer(room);
  const core = createFakeCore();
  const session = createOnlineClient(
    { url: 'localhost:38281', slotName: 'Link', ...(room.password !== undefined ? { password: room.password } : {}), ...extra },
    { core, createSocket: server.createSocket, adapter },
  );
  await session.start();
  await settle();
  return { server, core, session };
};

export { boot };
