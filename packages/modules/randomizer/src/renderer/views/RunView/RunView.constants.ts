/* @layer renderer-shell @kind constants */
const PANEL_MIN_WIDTH = 280;
const NO_GAME_MESSAGE = 'No randomizer game is registered.';
const NO_RUN_MESSAGE = 'No seed placed yet. Start the game to begin a run.';
const STATUS_LABEL = 'Status';
const MODE_LABEL = 'Mode';
const GAME_LABEL = 'Game';
const SEED_LABEL = 'Seed';
const GAME_STATE_TEXT = { running: 'Running', stopped: 'Stopped' } as const;
const NO_MODE = 'none';

export { GAME_LABEL, GAME_STATE_TEXT, MODE_LABEL, NO_GAME_MESSAGE, NO_MODE, NO_RUN_MESSAGE, PANEL_MIN_WIDTH, SEED_LABEL, STATUS_LABEL };
