/* @layer core @kind logic */
import type { FileStore } from '../platform/ports/file-store.type';
import type { WriteJsonOptions } from './json.type';
import { serialize } from './serialize';

const writeJson = (files: FileStore, path: string, data: unknown, opts: WriteJsonOptions = {}): Promise<void> =>
  files.writeText(path, serialize(data, opts));

export { writeJson };
