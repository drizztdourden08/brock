/* @layer electron-main @kind logic */
import type { ClipboardImage } from './clipboard-backend.type';
import { pngSize } from './png-size';

const pngImageOf = (raw: Uint8Array): ClipboardImage | null => {
  if (raw.length === 0) return null;
  const size = pngSize(raw);
  if (size === null) throw new Error('The clipboard image is not a whole PNG within the size limits');
  return { ...size, png: () => raw };
};

export { pngImageOf };
