/* @layer tooling-scripts @kind logic */
import { readInstalled } from '../doctor/installed-package.mjs';
import { satisfiesRange } from './satisfies-range.mjs';

const TESSERA = '@drizztdourden08/tessera';
const BROCK_REACT = '@drizztdourden08/brock-react';

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
