/* @layer electron-main @kind logic */
import { CLIPBOARD_LIMITS, PNG_END, PNG_HEADER_BYTES, PNG_SIGNATURE } from './clipboard-limits.constants';

interface PngSize {
  width: number;
  height: number;
}

const startsWith = (bytes: Uint8Array, at: number, expected: number[]): boolean => expected.every((value, index) => bytes[at + index] === value);

const pngSize = (bytes: Uint8Array): PngSize | null => {
  if (bytes.length < PNG_HEADER_BYTES + PNG_END.length) return null;
  if (!startsWith(bytes, 0, PNG_SIGNATURE)) return null;
  if (!startsWith(bytes, 8, [0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52])) return null;
  if (!startsWith(bytes, bytes.length - PNG_END.length, PNG_END)) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const width = view.getUint32(16);
  const height = view.getUint32(20);
  if (width < 1 || height < 1 || width > CLIPBOARD_LIMITS.side || height > CLIPBOARD_LIMITS.side) return null;
  return width * height > CLIPBOARD_LIMITS.pixels ? null : { width, height };
};

export { pngSize };
export type { PngSize };
