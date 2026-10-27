/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { satisfiesRange } from './satisfies-range.mjs';

const TESSERA = '@drizztdourden08/tessera';
const BROCK_REACT = '@drizztdourden08/brock-react';

/**
 * @param {string} appDir
 * @param {string} name
 * @returns {{ version?: string, peerDependencies?: Record<string, string> } | null} walks up from the app folder
 */
const readInstalled = (appDir, name) => {
  let current = appDir;
  for (;;) {
    const file = join(current, 'node_modules', name, 'package.json');
    if (existsSync(file)) {
      try {
        return JSON.parse(readFileSync(file, 'utf8'));
      } catch {
        return null;
      }
    }
    const parent = dirname(current);
    if (parent === current) return null;
    current = parent;
  }
};

/** @param {string} range */
const installCommand = (range) => (/[\s<>|]/.test(range) ? `pnpm up "${TESSERA}@${range}"` : `pnpm up ${TESSERA}@${range}`);

/**
 * @param {string} appDir
 * @returns {{ react: string, range: string, tessera: string, command: string, line: string } | null} null when they agree
 */
const tesseraMismatch = (appDir) => {
  const react = readInstalled(appDir, BROCK_REACT);
  const tessera = readInstalled(appDir, TESSERA);
  const range = react?.peerDependencies?.[TESSERA];
  if (!react?.version || !tessera?.version || !range) return null;
  if (satisfiesRange(tessera.version, range)) return null;
  return {
    react: react.version,
    range,
    tessera: tessera.version,
    command: installCommand(range),
    line: `brock-react ${react.version} needs Tessera ${range}, this app has ${tessera.version}. Run ${installCommand(range)}.`,
  };
};

export { tesseraMismatch };
