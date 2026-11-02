/* @layer renderer-shell @kind constants */
import type { FolderCheck } from './DocumentFolderField.type';

const FOLDER_FIELD_TEXT = {
  placeholder: 'No folder chosen',
  roots: 'Folders of the project',
  rootsPlaceholder: 'Pick a folder of the project',
} as const;

const NO_CHECK: FolderCheck = { path: null, reason: null };

export { FOLDER_FIELD_TEXT, NO_CHECK };
