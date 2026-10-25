/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { NOTES_DIR } from '@drizztdourden08/standards/release-notes';

/**
 * @param {{ repoDir: string, appDir: string, rootFallback: boolean }} input appDir is from the repo root, '.' for a root app
 * @returns {{ root: string, dir: string, fallback: boolean }} the notes folder and its parent, from the repo root
 */
const resolveNotesRoot = ({ repoDir, appDir, rootFallback }) => {
  if (appDir === '.') return { root: '.', dir: NOTES_DIR, fallback: false };
  const own = { root: appDir, dir: `${appDir}/${NOTES_DIR}`, fallback: false };
  const atRoot = rootFallback && !existsSync(join(repoDir, own.dir)) && existsSync(join(repoDir, NOTES_DIR));
  return atRoot ? { root: '.', dir: NOTES_DIR, fallback: true } : own;
};

export { resolveNotesRoot };
