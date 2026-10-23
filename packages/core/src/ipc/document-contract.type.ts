/* @layer core @kind types */
import type { DocumentDialogOptions } from '../platform/ports/documents.type';

interface DocumentInvokeContract {
  'document:open': (opts?: DocumentDialogOptions) => Promise<string | null>;
  'document:saveAs': (opts?: DocumentDialogOptions) => Promise<string | null>;
  'document:read': (path: string) => Promise<ArrayBuffer>;
  'document:readText': (path: string) => Promise<string>;
  'document:write': (path: string, data: ArrayBuffer) => Promise<void>;
  'document:writeText': (path: string, text: string) => Promise<void>;
}

export type { DocumentInvokeContract };
