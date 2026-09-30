/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

/**
 * @param {string} file a line-based file such as .gitignore
 * @param {string[]} lines
 * @returns {string[]} the lines appended
 */
const ensureLines = (file, lines) => {
  const current = existsSync(file) ? readFileSync(file, 'utf8').replace(/\r\n/g, '\n') : '';
  const present = new Set(current.split('\n').map((line) => line.trim()));
  const missing = lines.filter((line) => !present.has(line.trim()));
  if (!missing.length) return [];
  const base = current && !current.endsWith('\n') ? `${current}\n` : current;
  writeFileSync(file, `${base}${missing.join('\n')}\n`, 'utf8');
  return missing;
};

export { ensureLines };
