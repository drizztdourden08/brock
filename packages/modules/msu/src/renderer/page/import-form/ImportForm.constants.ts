/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { ImportStatus } from './ImportForm.type';

const DEFAULT_PLACEHOLDER = msg('msu:import.defaultPlaceholder');
const DEFAULT_ACCEPT = ['.zip'];
const DEFAULT_DROP_LABEL = msg('msu:import.defaultDropLabel');

const NO_STATUS: ImportStatus = { message: '', variant: '' };

export { DEFAULT_ACCEPT, DEFAULT_DROP_LABEL, DEFAULT_PLACEHOLDER, NO_STATUS };
