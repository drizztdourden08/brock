/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { FolderCheck } from './DocumentFolderField.type';

const FOLDER_FIELD_TEXT = {
  placeholder: msg('brock-app:documents.folder.placeholder'),
  roots: msg('brock-app:documents.folder.roots'),
  notFolder: msg('brock-app:documents.folder.notFolder'),
  rootsPlaceholder: msg('brock-app:documents.folder.rootsPlaceholder'),
} as const;

const NO_CHECK: FolderCheck = { path: null, reason: null };

export { FOLDER_FIELD_TEXT, NO_CHECK };
