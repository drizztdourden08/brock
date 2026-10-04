/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { GENERATED_IMPORT, RENDERER_ENTRY } from './freshness.constants.mjs';

const EXTENSIONS = ['', '.ts', '.tsx'];

/** @param {string} file */
const resolves = (file) => EXTENSIONS.some((extension) => existsSync(`${file}${extension}`));

/**
 * @param {string} appDir
 * @returns {string | null} what the renderer entry imports that does not exist, or null
 */
const rendererEntryProblem = (appDir) => {
  const entry = join(appDir, RENDERER_ENTRY);
  if (!existsSync(entry)) return null;
  const source = readFileSync(entry, 'utf8');
  const missing = [...source.matchAll(GENERATED_IMPORT)].map((match) => match[1]).filter((spec) => !resolves(resolve(appDir, 'src', spec)));
  if (!missing.length) return null;
  return `${RENDERER_ENTRY} imports ${missing.join(', ')}, which brock sync did not write. Run \`brock sync\` and read its errors.`;
};

export { rendererEntryProblem };
