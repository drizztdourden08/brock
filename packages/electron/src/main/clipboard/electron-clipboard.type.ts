/* @layer electron-main @kind types */
import type { NativeImage } from 'electron';

interface LegacyClipboard {
  readText: () => string;
  readBuffer: (format: string) => Uint8Array;
  availableFormats: () => string[];
  readImage: () => NativeImage;
  write: (data: { text?: string; image?: NativeImage }) => void;
  writeBuffer: (format: string, buffer: Buffer) => void;
  clear: () => void;
}

interface AsyncClipboardItem {
  readonly types: readonly string[];
  getType: (type: string) => Promise<Blob>;
}

interface AsyncClipboard {
  read: () => Promise<AsyncClipboardItem[]>;
  readText: () => Promise<string>;
  write: (items: AsyncClipboardItem[]) => Promise<void>;
  clear: () => void;
}

type ClipboardItemCtor = new (items: Record<string, Blob | string>) => AsyncClipboardItem;

export type { AsyncClipboard, AsyncClipboardItem, ClipboardItemCtor, LegacyClipboard };
