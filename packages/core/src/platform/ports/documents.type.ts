/* @layer core @kind types */
interface DocumentFilter {
  name: string;
  extensions: string[];
}

interface DocumentDialogOptions {
  title?: string;
  filters?: DocumentFilter[];
  defaultPath?: string;
}

interface DocumentsPort {
  open: (opts?: DocumentDialogOptions) => Promise<string | null>;
  saveAs: (opts?: DocumentDialogOptions) => Promise<string | null>;
  read: (path: string) => Promise<Uint8Array>;
  readText: (path: string) => Promise<string>;
  write: (path: string, data: Uint8Array) => Promise<void>;
  writeText: (path: string, text: string) => Promise<void>;
}

export type { DocumentDialogOptions, DocumentFilter, DocumentsPort };
