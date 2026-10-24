/* @layer tooling-scripts @kind logic */
import { pathToFileURL } from 'node:url';

/**
 * @template {{ file: string }} T
 * @param {T[]} migrations
 * @param {string} id the migration id, as the module exports it
 * @returns {Promise<T[]>} the migrations with that id, whatever their version folder
 */
const selectById = async (migrations, id) => {
  const found = [];
  for (const entry of migrations) {
    const { migration } = await import(pathToFileURL(entry.file).href);
    if (migration?.id === id) found.push(entry);
  }
  return found;
};

export { selectById };
