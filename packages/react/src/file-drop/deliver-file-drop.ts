/* @layer renderer-shell @kind logic */
import type { PathDrop } from '../dnd';
import { readDropped } from './read-dropped';
import { selectDropped } from './select-dropped';
import type { FileDrop, FileDropOptions } from './file-drop.type';

const deliverFileDrop = async (drop: PathDrop, options: FileDropOptions): Promise<void> => {
  const picked = selectDropped(drop.paths, options.extensions, options.max);
  const read = options.read ? await readDropped(picked.paths, options.read) : { reads: [], rejected: [] };
  const failed = new Set(read.rejected.map((entry) => entry.name));
  const paths = picked.paths.filter((entry) => !failed.has(entry.name));
  const result: FileDrop = { ...drop, paths, rejected: [...drop.rejected, ...picked.rejected, ...read.rejected], reads: read.reads };
  options.onDrop(result);
};

export { deliverFileDrop };
