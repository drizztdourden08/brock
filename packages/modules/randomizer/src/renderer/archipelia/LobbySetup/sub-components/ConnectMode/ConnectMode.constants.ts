/* @layer renderer-shell @kind constants */
import type { LobbyConnect } from '../../../lobby-setup';

const CONNECT_OPTIONS: { value: LobbyConnect; label: string }[] = [
  { value: 'auto', label: 'Auto' },
  { value: 'manual', label: 'Manual' },
];

const REMOTE_NEEDS_ADDRESS = 'A remote lobby is joined by address';

export { CONNECT_OPTIONS, REMOTE_NEEDS_ADDRESS };
