/* @layer core @kind logic */
import { SPHERE_OPEN } from './ap-spoiler.constants';
import type { SpoilerSphere } from './ap-spoiler.type';
import { spoilerEntryOf } from './spoiler-entry-of';

const readPlaythroughLine = (line: string, spheres: SpoilerSphere[], current: SpoilerSphere | null): SpoilerSphere | null => {
  if (SPHERE_OPEN.test(line)) return [];
  if (current === null) return null;
  if (line.startsWith('}')) {
    spheres.push(current);
    return null;
  }
  const entry = spoilerEntryOf(line);
  if (entry !== null) current.push(entry);
  return current;
};

export { readPlaythroughLine };
