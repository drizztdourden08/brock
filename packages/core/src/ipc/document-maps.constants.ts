/* @layer core @kind constants */
import type { DocumentInvokeContract } from './document-contract.type';

const DOCUMENT_INVOKE_MAP = {
  documentOpen: 'document:open',
  documentSaveAs: 'document:saveAs',
  documentRead: 'document:read',
  documentReadText: 'document:readText',
  documentWrite: 'document:write',
  documentWriteText: 'document:writeText',
} as const satisfies Record<string, keyof DocumentInvokeContract>;

export { DOCUMENT_INVOKE_MAP };
