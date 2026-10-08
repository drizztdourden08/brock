/* @layer electron-main @kind logic */
import { basename } from 'path';

const findBinaries = (entries: readonly string[], wanted: readonly string[]): Map<string, string> => {
  const found = new Map<string, string>();
  for (const name of wanted) {
    const match = entries.find((entry) => basename(entry.replace(/\\/g, '/')).toLowerCase() === name.toLowerCase());
    if (match === undefined) throw new Error(`the download holds no ${name}`);
    found.set(name, match);
  }
  return found;
};

export { findBinaries };
