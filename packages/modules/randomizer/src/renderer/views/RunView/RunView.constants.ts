/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
const NO_GAME_MESSAGE = msg('randomizer:view.noGame');
const NO_PROFILE_MESSAGE = msg('randomizer:view.noProfile');

const RUN_SPANS = {
  summary: 1,
  progress: 1,
  activity: 1,
  players: 2,
  settings: 2,
  game: 'full',
} as const;

export { NO_GAME_MESSAGE, NO_PROFILE_MESSAGE, RUN_SPANS };
