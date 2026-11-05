/* @layer renderer-shell @kind constants */
const NONE_LABEL = 'None';
const UNKNOWN_LABEL = 'Unknown';
const NO_STATUS_MESSAGE = 'Not connected to a server yet.';

const NETWORK_PANELS = {
  setup: 1,
  connection: 1,
  health: 1,
  progress: 1,
  players: 2,
  server: 1,
} as const;

export { NETWORK_PANELS, NONE_LABEL, NO_STATUS_MESSAGE, UNKNOWN_LABEL };
