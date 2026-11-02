/* @layer renderer-shell @kind logic */
import type { DroppedPath, RejectedFile } from '../dnd';
import type { Selection } from './file-drop.type';
import { FILE_DROP_DEFAULT_MAX, FILE_DROP_MAX_CAP, NOT_SUPPORTED_FILE, TOO_MANY_FILES } from './file-drop.constants';

const suffixOf = (name: string): string => {
  const dot = name.lastIndexOf('.');
  return dot < 0 ? '' : name.slice(dot + 1).toLowerCase();
};

const wantedSet = (extensions: readonly string[]): ReadonlySet<string> => new Set(extensions.map((entry) => entry.replace(/^\./, '').toLowerCase()));

const limitOf = (max: number | undefined): number => Math.min(Math.max(Math.floor(max ?? FILE_DROP_DEFAULT_MAX), 1), FILE_DROP_MAX_CAP);

const selectDropped = (paths: readonly DroppedPath[], extensions: readonly string[] | undefined, max: number | undefined): Selection => {
  const wanted = extensions ? wantedSet(extensions) : null;
  const limit = limitOf(max);
  const kept: DroppedPath[] = [];
  const rejected: RejectedFile[] = [];
  for (const entry of paths) {
    if (wanted && entry.kind === 'file' && !wanted.has(suffixOf(entry.name))) rejected.push({ name: entry.name, reason: NOT_SUPPORTED_FILE });
    else if (kept.length >= limit) rejected.push({ name: entry.name, reason: TOO_MANY_FILES });
    else kept.push(entry);
  }
  return { paths: kept, rejected };
};

export { selectDropped };
