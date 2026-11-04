/* @layer core @kind logic */
import { readStorage } from '../storage/read-storage';
import { writeStorage } from '../storage/write-storage';
import { LEGACY_UUID_KEY, UUID_KEY } from './client-uuid.constants';
import type { PageOnlyUuidState } from './client-uuid.type';

const pageOnlyUuid: PageOnlyUuidState = { uuid: null };

const freshUuid = (): string => {
  const cryptoApi = (globalThis as { crypto?: Crypto }).crypto;
  if (cryptoApi?.randomUUID) return cryptoApi.randomUUID();
  return `brock-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
};

const legacyOrFresh = (): string => {
  const legacy = readStorage(LEGACY_UUID_KEY);
  return legacy === null || legacy === '' ? freshUuid() : legacy;
};

const clientUuid =(): string => {
  const stored = readStorage(UUID_KEY);
  if (stored) return stored;
  const next = legacyOrFresh();
  if (writeStorage(UUID_KEY, next)) return next;
  pageOnlyUuid.uuid ??= next;
  return pageOnlyUuid.uuid;
};

export { clientUuid };
