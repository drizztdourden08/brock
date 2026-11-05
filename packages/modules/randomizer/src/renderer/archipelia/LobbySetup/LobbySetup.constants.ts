/* @layer renderer-shell @kind constants */
import type { LobbyLocation } from '../lobby-setup';

const LOCATION_OPTIONS: { value: LobbyLocation; label: string }[] = [
  { value: 'local', label: 'Local' },
  { value: 'lan', label: 'LAN' },
  { value: 'remote', label: 'Remote' },
];

const NAME_PLACEHOLDER = 'Player Name / Slot Name';

export { LOCATION_OPTIONS, NAME_PLACEHOLDER };
