/* @layer core @kind types */
type ClipboardValue = string | Uint8Array;

type ClipboardEntries = Record<string, ClipboardValue>;

type ClipboardWireValue = string | ArrayBuffer;

type ClipboardWireEntries = Record<string, ClipboardWireValue>;

interface ClipboardPort {
  readText: () => Promise<string>;
  write: (entries: ClipboardEntries) => Promise<void>;
  read: (types: string[]) => Promise<ClipboardEntries>;
  onChange: (listener: () => void) => () => void;
}

export type { ClipboardEntries, ClipboardPort, ClipboardValue, ClipboardWireEntries, ClipboardWireValue };
