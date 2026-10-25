/* @layer renderer-shell @kind logic */
import { inputApi } from '../../../../../renderer/input-api';
import type { DeviceEntry } from '../../../../../device.type';
import { CLAIM_TIMEOUT_MS, LAYOUT_POLL_MS } from '../diagnostics-wizard.constants';
import { sleep } from './sleep';

const awaitClaimedEntry = async (deviceKey: string): Promise<DeviceEntry | null> => {
  const deadline = Date.now() + CLAIM_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const entries = await inputApi().list();
    const match = entries.find((d) => d.deviceKey === deviceKey && d.status === 'ready' && d.hasButton?.length);
    if (match) return match;
    await sleep(LAYOUT_POLL_MS);
  }
  return null;
};

export { awaitClaimedEntry };
