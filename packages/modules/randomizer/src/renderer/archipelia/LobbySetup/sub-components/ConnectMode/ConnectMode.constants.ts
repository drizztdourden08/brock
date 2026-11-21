/* @layer renderer-shell @kind constants */
import { msg, type Text } from '@drizztdourden08/brock-core/i18n';
import type { LobbyConnect } from '../../../lobby-setup';

const CONNECT_OPTIONS: { value: LobbyConnect; label: Text }[] = [
  { value: 'auto', label: msg('randomizer:lobby.connect.auto') },
  { value: 'manual', label: msg('randomizer:lobby.connect.manual') },
];
const REMOTE_NEEDS_ADDRESS = msg('randomizer:lobby.connect.remoteNeedsAddress');
const CONNECT_LABEL = msg('randomizer:lobby.connect.label');

export { CONNECT_LABEL, CONNECT_OPTIONS, REMOTE_NEEDS_ADDRESS };
