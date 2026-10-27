/* @layer tooling-scripts @kind logic */
import { isAbsolute } from 'node:path';
import { DIRTY_WINDOW_MS } from './build-reuse.constants.mjs';
import { stampOf } from './file-stamp.mjs';

const fileOf = (id) => id.replace(/[?#].*$/, '');

/**
 * @param {Iterable<string>} ids the module ids a build read
 * @param {number} startedAt when the build began, in ms
 * @param {(file: string) => string | null} [stamp] reads a file stamp
 * @returns {Record<string, string | null>} file stamps, null for a file touched mid-build
 */
const moduleStamps = (ids, startedAt, stamp = stampOf) => {
  const stamps = {};
  for (const id of ids) {
    if (id.startsWith('\0') || !isAbsolute(fileOf(id))) continue;
    const file = fileOf(id);
    const value = stamp(file);
    if (value === null) continue;
    stamps[file] = Number(value.split(':')[0]) >= startedAt - DIRTY_WINDOW_MS ? null : value;
  }
  return stamps;
};

export { moduleStamps };
