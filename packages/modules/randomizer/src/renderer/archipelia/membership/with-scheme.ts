/* @layer renderer-shell @kind logic */
import type { StartedRoom } from '../../../archipelago/lobby';

const withScheme = (address: string, tls: StartedRoom['tls']): string => {
  if (tls === 'yes') return `wss://${address}`;
  return tls === 'no' ? `ws://${address}` : address;
};

export { withScheme };
