/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
const NO_GAME_MESSAGE = msg('randomizer:view.noGame');
const NO_PLACEMENT_MESSAGE = 'No placement yet. Start a run to see where items went.';
const SPOILER_CHECKS_PREFS = { grouping: 'sphere', viewMode: 'detailed' } as const;

export { NO_GAME_MESSAGE, NO_PLACEMENT_MESSAGE, SPOILER_CHECKS_PREFS };
