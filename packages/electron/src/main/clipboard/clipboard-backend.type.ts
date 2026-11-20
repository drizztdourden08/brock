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
  readText: () => Promise<string>;
  readBuffer: (type: string) => Promise<Uint8Array>;
  readImage: () => Promise<ClipboardImage | null>;
  write: (bundle: ClipboardBundle) => Promise<void>;
  fingerprint: () => Promise<string>;
}

export type { ClipboardBackend, ClipboardBundle, ClipboardImage };
