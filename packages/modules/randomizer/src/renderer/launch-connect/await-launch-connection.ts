/* @layer renderer-shell @kind logic */
import { CONNECTION_FAILURE_TEXT } from './launch-connect.constants';
import type { ConnectionWatch, LaunchConnectHost } from './launch-connect.type';
import { launchesConnection } from './launches-connection';
import { waitForConnection } from './wait-for-connection';

const awaitLaunchConnection = async (
  host: LaunchConnectHost,
  watch: ConnectionWatch,
  isCancelled: () => boolean,
): Promise<boolean> => {
  if (!launchesConnection(host.log)) return true;
  host.log('[LaunchConnect] Waiting for the Archipelago client to connect');
  const verdict = await waitForConnection(watch, isCancelled);
  if (verdict === 'connected') {
    host.log('[LaunchConnect] Archipelago client connected');
    return true;
  }
  if (verdict !== 'cancelled') host.log(`[LaunchConnect] ${CONNECTION_FAILURE_TEXT[verdict]}`, 'error');
  return false;
};

export { awaitLaunchConnection };
