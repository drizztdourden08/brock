/* @layer renderer-shell @kind logic */
import { expandDroppedFolders } from './expand-dropped-folders';
import { NOT_SUPPORTED, NOT_VETTED } from './to-path-drop.constants';
import type { DroppedFiles } from './dnd.type';
import type { DroppedPath, PathDrop, PathDropOptions, RejectedFile } from './path-drop.type';

const extensionOf = (name: string): string => {
  const dot = name.lastIndexOf('.');
  return dot < 0 ? '' : name.slice(dot + 1).toLowerCase();
};

const allows = (extensions: readonly string[] | undefined, name: string): boolean =>
  !extensions || extensions.some((extension) => extension.replace(/^\./, '').toLowerCase() === extensionOf(name));

const toPathDrop = async (dropped: DroppedFiles, options: PathDropOptions = {}): Promise<PathDrop> => {
  const paths: DroppedPath[] = [];
  const rejected: RejectedFile[] = [...dropped.rejected];
  for (const file of dropped.files) {
    if (file.path === null) rejected.push({ name: file.name, reason: NOT_VETTED });
    else if (file.kind === 'file' && !allows(options.extensions, file.name)) rejected.push({ name: file.name, reason: NOT_SUPPORTED });
    else paths.push({ path: file.path, name: file.name, kind: file.kind });
  }
  const expanded = options.expand
    ? await expandDroppedFolders(paths.filter((entry) => entry.kind === 'folder'), options.expand)
    : { entries: [], rejected: [], truncated: false };
  return { origin: 'os', paths, rejected: [...rejected, ...expanded.rejected], entries: expanded.entries, truncated: expanded.truncated };
};

export { toPathDrop };
