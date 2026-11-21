/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import { LOBBY_CODE_ALPHABET } from '../../../../../archipelago/lobby';

const CODE_PATTERN = '{left:text len4 upper}-{right:text len4 upper}';
const CODE_ALIASES = { I: '1', L: '1', O: '0' };
const CODE_LABEL = msg('randomizer:lobby.code.label');
const CODE_SLOT_LABELS = { left: msg('randomizer:lobby.code.first'), right: msg('randomizer:lobby.code.second') };
const CODE_SLOT_RULES = { placeholder: 'XXXX', chars: LOBBY_CODE_ALPHABET, aliases: CODE_ALIASES };

export { CODE_LABEL, CODE_PATTERN, CODE_SLOT_LABELS, CODE_SLOT_RULES };
