/* @layer renderer-shell @kind logic */
import type { DroppedPath } from '../dnd';
import { getPlatform } from '../platform/get-platform';
import { NOT_READABLE } from './file-drop.constants';
import type { ReadResult } from './file-drop.type';

const toBuffer = (bytes: Uint8Array): ArrayBuffer => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;

const readOne = async (path: string, mode: 'bytes' | 'text'): Promise<ArrayBuffer | string> => {
  const documents = getPlatform().documents;
  if (!documents) throw new Error(NOT_READABLE);
  return mode === 'text' ? documents.readText(path) : toBuffer(await documents.read(path));
};

const readDropped = async (paths: readonly DroppedPath[], mode: 'bytes' | 'text'): Promise<ReadResult> => {
  const result: ReadResult = { reads: [], rejected: [] };
  for (const entry of paths) {
    if (entry.kind !== 'file') continue;
    try {
      result.reads.push({ path: entry.path, data: await readOne(entry.path, mode) });
    } catch (error) {
      result.rejected.push({ name: entry.name, reason: error instanceof Error && error.message ? error.message : NOT_READABLE });
    }
  }
  return result;
};

export { readDropped };
