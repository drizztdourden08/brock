/* @layer renderer-shell @kind constants */
import type { PatternSlotConfigs } from '@drizztdourden08/tessera/composites';
import { LOBBY_CODE_ALPHABET } from '../../../../../archipelago/lobby';

const CODE_PATTERN = '{left:text len4 upper}-{right:text len4 upper}';

const CODE_ALIASES = { I: '1', L: '1', O: '0' };

const CODE_SLOTS: PatternSlotConfigs = {
  left: { label: 'First half', placeholder: 'XXXX', chars: LOBBY_CODE_ALPHABET, aliases: CODE_ALIASES },
  right: { label: 'Second half', placeholder: 'XXXX', chars: LOBBY_CODE_ALPHABET, aliases: CODE_ALIASES },
};

export { CODE_PATTERN, CODE_SLOTS };
