/* @layer renderer-shell @kind constants */
import type { ImportProgressState } from './use-import-progress.type';

const IDLE: ImportProgressState = { active: false, percent: null, label: '' };

export { IDLE };
