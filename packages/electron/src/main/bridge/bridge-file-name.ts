/* @layer electron-main @kind logic */
import { BRIDGE_DISCOVERY_NAME } from './bridge.constants';

const bridgeFileName = (key: string | null): string => {
  const safe = (key ?? '').toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 48);
  return safe ? `${BRIDGE_DISCOVERY_NAME}.${safe}.json` : `${BRIDGE_DISCOVERY_NAME}.json`;
};

export { bridgeFileName };
