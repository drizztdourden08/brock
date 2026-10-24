/* @layer electron-main @kind logic */
import { containLink } from './contain-link';
import type { FolderGrants } from './folder-grants.type';
import { writeDenied } from './write-denied';

const containNew = async (contain: FolderGrants['contain'], path: string): Promise<string | null> => {
  const target = await containLink(contain, path);
  if (target === null || writeDenied(target)) return null;
  return (await contain(target, true)) === null ? null : target;
};

export { containNew };
