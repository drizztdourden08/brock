/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
const NONE_LABEL = msg('randomizer:common.none');
const UNKNOWN_LABEL = msg('randomizer:common.unknown');
const NO_STATUS_MESSAGE = msg('randomizer:network.noStatus');

const NETWORK_PANELS = {
  setup: 1,
  connection: 1,
  health: 1,
  progress: 1,
  players: 2,
  server: 1,
} as const;

export { NETWORK_PANELS, NONE_LABEL, NO_STATUS_MESSAGE, UNKNOWN_LABEL };
