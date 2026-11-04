/* @layer core @kind logic */
import { serverCandidates } from '../address/server-candidates';
import { probeOnce } from './probe-once';
import type { ProbeConfig, ProbeResult } from './probe.type';

const probeServer = async (config: ProbeConfig): Promise<ProbeResult> => {
  const candidates = serverCandidates(config.url);
  if (candidates.length === 0) return { ok: false, reason: 'no server URL' };
  let last: ProbeResult = { ok: false, reason: 'no server URL' };
  for (const url of candidates) {
    const { result, opened } = await probeOnce(url, config);
    if (result.ok || opened) return result;
    last = result;
  }
  return last;
};

export { probeServer };
