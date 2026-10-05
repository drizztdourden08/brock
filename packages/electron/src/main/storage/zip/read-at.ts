/* @layer electron-main @kind logic */
import type { FileHandle } from 'fs/promises';

const readAt = async (handle: FileHandle, position: number, length: number): Promise<Buffer> => {
  const buffer = Buffer.alloc(length);
  const { bytesRead } = await handle.read(buffer, 0, length, position);
  return buffer.subarray(0, bytesRead);
};

export { readAt };
