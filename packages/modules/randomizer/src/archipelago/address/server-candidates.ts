/* @layer core @kind logic */
import { SCHEME } from './address.constants';
import { isLocalServerAddress } from './server-host-locality';
import { normalizeServerUrl } from './normalize-server-url';

const serverCandidates = (raw: string): string[] => {
  const trimmed = normalizeServerUrl(raw);
  if (!trimmed) return [];
  if (SCHEME.test(trimmed)) return [trimmed];
  if (isLocalServerAddress(trimmed)) return [`ws://${trimmed}`];
  return [`wss://${trimmed}`, `ws://${trimmed}`];
};

export { serverCandidates };
