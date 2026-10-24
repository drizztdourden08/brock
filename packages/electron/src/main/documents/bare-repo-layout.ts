/* @layer electron-main @kind logic */
import { readdir } from 'fs/promises';
import { dirname, parse } from 'path';
import { BARE_REPO_NAMES } from './repo-paths.constants';

const namesIn = async (dir: string): Promise<Set<string>> => {
  try {
    return new Set((await readdir(dir)).map((name) => name.toLowerCase()));
  } catch {
    return new Set();
  }
};

const completesLayout = async (dir: string, written: string): Promise<boolean> => {
  const present = await namesIn(dir);
  return BARE_REPO_NAMES.every((name) => name === written || present.has(name));
};

const touched = (real: string): { dir: string; name: string }[] => {
  const found: { dir: string; name: string }[] = [];
  let current = real;
  for (let leaf = true; dirname(current) !== current; leaf = false) {
    const name = parse(current).base.toLowerCase();
    if (leaf ? name === 'head' : name === 'objects' || name === 'refs') found.push({ dir: dirname(current), name });
    current = dirname(current);
  }
  return found;
};

const bareRepoLayout = async (real: string): Promise<boolean> => {
  for (const { dir, name } of touched(real)) {
    if (await completesLayout(dir, name)) return true;
  }
  return false;
};

export { bareRepoLayout };
