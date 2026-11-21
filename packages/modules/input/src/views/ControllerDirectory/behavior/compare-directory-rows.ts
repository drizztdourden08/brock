/* @layer renderer-shell @kind logic */
import type { DirectoryRow } from '../ControllerDirectory.type';

const compareDirectoryRows = (a: DirectoryRow, b: DirectoryRow): number => {
  if (a.group !== b.group) return a.group === 'connected' ? -1 : 1;
  return a.name.localeCompare(b.name);
};

export { compareDirectoryRows };
