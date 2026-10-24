/* @layer core @kind constants */
import type { DocumentEventContract, DocumentInvokeContract } from './document-contract.type';

const DOCUMENT_INVOKE_MAP = {
  documentOpen: 'document:open',
  documentSaveAs: 'document:saveAs',
  documentOpenFolder: 'document:openFolder',
  documentList: 'document:list',
  documentRevokeFolder: 'document:revokeFolder',
  documentTrash: 'document:trash',
  documentReveal: 'document:reveal',
  documentRename: 'document:rename',
  documentMkdir: 'document:mkdir',
  documentWatch: 'document:watch',
  documentUnwatch: 'document:unwatch',
  documentRememberedFolders: 'document:rememberedFolders',
  documentRegrant: 'document:regrant',
  documentForgetFolder: 'document:forgetFolder',
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

const DOCUMENT_EVENT_MAP = {
  onDocumentWatch: 'document:watchEvent',
} as const satisfies Record<string, keyof DocumentEventContract>;

export { DOCUMENT_EVENT_MAP, DOCUMENT_INVOKE_MAP };
