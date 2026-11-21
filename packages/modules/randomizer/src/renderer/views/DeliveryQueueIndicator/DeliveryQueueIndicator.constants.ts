/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { StatusTone } from '@drizztdourden08/tessera/primitives';

const MAX_VISIBLE = 20;

const INCOMING_TITLE = msg('randomizer:deliveries.incoming');

const SOURCE_TONES: readonly (readonly [string, StatusTone])[] = [
  ['cheat', 'warning'],
  ['randomizer', 'primary'],
  ['network', 'info'],
  ['system', 'neutral'],
  ['player', 'success'],
];

const UNKNOWN_SOURCE_TONE: StatusTone = 'secondary';

export { INCOMING_TITLE, MAX_VISIBLE, SOURCE_TONES, UNKNOWN_SOURCE_TONE };
