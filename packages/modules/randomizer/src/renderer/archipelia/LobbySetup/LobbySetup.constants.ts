/* @layer renderer-shell @kind constants */
import { msg, type Text } from '@drizztdourden08/brock-core/i18n';
import type { LobbyLocation } from '../lobby-setup';

const LOCATION_OPTIONS: { value: LobbyLocation; label: Text }[] = [
  { value: 'local', label: msg('randomizer:lobby.location.local') },
  { value: 'lan', label: msg('randomizer:lobby.location.lan') },
  { value: 'remote', label: msg('randomizer:lobby.location.remote') },
];
const LOCATION_LABEL = msg('randomizer:lobby.locationLabel');
const NAME_LABEL = msg('randomizer:lobby.nameLabel');

const NAME_PLACEHOLDER = msg('randomizer:lobby.namePlaceholder');

export { LOCATION_LABEL, LOCATION_OPTIONS, NAME_LABEL, NAME_PLACEHOLDER };
