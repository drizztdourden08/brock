/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';

const STUDIO_LABEL = msg('msu:studio.label');
const NO_PACK_MESSAGE = msg('msu:studio.noPack');

const DETAILS_PANEL = { title: msg('msu:studio.details'), storageKey: 'msu-studio.details', width: 400, minWidth: 288, maxWidth: 640 };

const EDITOR_LABELS = {
  music: msg('msu:studio.editor.music'),
  files: msg('msu:studio.editor.files'),
} as const;

export { DETAILS_PANEL, EDITOR_LABELS, NO_PACK_MESSAGE, STUDIO_LABEL };
