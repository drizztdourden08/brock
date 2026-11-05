/* @layer core @kind barrel */
export { createFakeCore, defaultFakeCoreHooks, hashText } from './fake-core';
export { VERSION, createFakeServer } from './fake-server';
export {
  OWN, ROOM_MISMATCH, boot, collectNotices, createOnlineClient, installClientHarness, item, makeRoom, roomHashOf, settle,
  stubLocalStorage,
} from './protocol-harness';
export { createApworldRig, parseApSpoiler, replayForward } from './oracle';
export type { Delivery, FakeCore, FakeCoreHooks } from './fake-core';
export type { FakeRoom, FakeServer, FakeStorageRoom, FakeTrackedSlot } from './fake-server';
export type { HarnessAdapter, HarnessConfig, HarnessDeps, HarnessSession } from './protocol-harness';
export type {
  ApSpoiler, ApworldRig, ApworldRigConfig, ForwardVerdict, GenerationRun, ReplayModel, SpoilerSphere,
} from './oracle';
