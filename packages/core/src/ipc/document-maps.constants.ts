/* @layer core @kind constants */
import type { DocumentInvokeContract } from './document-contract.type';

const DOCUMENT_INVOKE_MAP = {
  documentOpen: 'document:open',
  documentSaveAs: 'document:saveAs',
  documentOpenFolder: 'document:openFolder',
  documentList: 'document:list',
  documentRead: 'document:read',
  documentReadText: 'document:readText',
  documentWrite: 'document:write',
  documentWriteText: 'document:writeText',
  documentRecent: 'document:recent',
  documentClearRecent: 'document:clearRecent',
  documentOpenRecent: 'document:openRecent',
  documentSnapshot: 'document:snapshot',
  documentRecoverable: 'document:recoverable',
  documentRestoreSnapshot: 'document:restoreSnapshot',
  documentDiscardSnapshot: 'document:discardSnapshot',
} as const satisfies Record<string, keyof DocumentInvokeContract>;

export { DOCUMENT_INVOKE_MAP };
