/* @layer renderer-shell @kind constants */
const NO_GAME_MESSAGE = 'No randomizer game is registered.';
const NO_PROFILE_MESSAGE = 'The active profile is not randomized.';

const RUN_SPANS = {
  summary: 1,
  progress: 1,
  activity: 1,
  players: 2,
  settings: 2,
  game: 'full',
} as const;

export { NO_GAME_MESSAGE, NO_PROFILE_MESSAGE, RUN_SPANS };
