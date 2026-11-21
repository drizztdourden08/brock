/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { Text } from '@drizztdourden08/brock-core/i18n';

const MUSIC_TAB: { id: string; label: Text } = { id: 'music', label: msg('msu:tab.music') };

const FILES_TAB: { id: string; label: Text } = { id: 'files', label: msg('msu:tab.files') };

const NAMES_SHOWN = 2;

export { FILES_TAB, MUSIC_TAB, NAMES_SHOWN };
