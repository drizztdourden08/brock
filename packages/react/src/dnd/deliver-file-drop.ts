/* @layer renderer-shell @kind logic */
import { FILES_DRAG_TYPE } from './dnd.constants';
import type { DropInfo } from './dnd.type';
import { resolveDroppedFiles } from './resolve-dropped-files';
import { toPathDrop } from './to-path-drop';
import type { TargetEntry } from './target-entry.type';

const deliverFileDrop = async (entry: TargetEntry, list: readonly File[], info: DropInfo): Promise<void> => {
  const dropped = await resolveDroppedFiles(list);
  const payload = info.type === FILES_DRAG_TYPE ? dropped : await toPathDrop(dropped, entry.options.paths);
  if (entry.options.canDrop?.(payload, info) ?? true) entry.options.onDrop(payload, info);
};

export { deliverFileDrop };
