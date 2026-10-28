/* @layer electron-main @kind types */
interface ClipboardImage {
  width: number;
  height: number;
  png: () => Uint8Array;
}

interface PrivateBytes {
  type: string;
  data: Uint8Array;
}

interface ClipboardBundle {
  text?: string;
  png?: Uint8Array;
  privates: PrivateBytes[];
}

interface ClipboardBackend {
  readText: () => string;
  readBuffer: (type: string) => Uint8Array;
  readImage: () => ClipboardImage | null;
  write: (bundle: ClipboardBundle) => void;
  fingerprint: () => string;
}

export type { ClipboardBackend, ClipboardBundle };
