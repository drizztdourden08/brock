/* @layer electron-main @kind logic */
import { lstat } from 'fs/promises';
import { LIST_LIMITS } from '../documents/list-limits.constants';
import { treeEntries } from '../documents/tree-entries';
import type { DragOutDeps } from './drag-out.type';
import { DRAG_OUT_MAX } from './drag-out.constants';

const refuseLinks = async (real: string): Promise<void> => {
  await treeEntries(real, LIST_LIMITS.entries).catch((error: unknown) => {
    throw new Error(`"${real}" cannot be dragged out: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
  });
};

const vetPath = async (resolve: DragOutDeps['resolve'], path: unknown): Promise<string> => {
  if (typeof path !== 'string') throw new Error('A drag out needs file paths');
  const real = await resolve(path);
  const asked = await lstat(path).catch(() => null);
  if (asked?.isSymbolicLink() === true) throw new Error(`"${path}" is a link and cannot be dragged out`);
  const info = await lstat(real).catch(() => null);
  if (info === null) throw new Error(`"${real}" does not exist`);
  if (info.isSymbolicLink()) throw new Error(`"${real}" is a link and cannot be dragged out`);
  if (!info.isFile() && !info.isDirectory()) throw new Error(`"${real}" is not a plain file or folder`);
  if (info.isDirectory()) await refuseLinks(real);
  return real;
};

const dragOut = async ({ resolve, fromApp, icon, start }: DragOutDeps, paths: unknown): Promise<void> => {
  if (!fromApp()) throw new Error('Only the app window can start a drag out');
  if (!Array.isArray(paths) || paths.length === 0 || paths.length > DRAG_OUT_MAX) throw new Error(`A drag out needs 1 to ${DRAG_OUT_MAX} paths`);
  const files = new Set<string>();
  for (const path of paths) files.add(await vetPath(resolve, path));
  const list = [...files];
  start(list, await icon(list[0] as string));
};

export { dragOut };
