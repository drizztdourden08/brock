/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const TESSERA = '@drizztdourden08/tessera';

const REACT_MANIFEST_NAME = 'brock-react.package.json';

const manifestCandidates = (templateDir) => [resolve(templateDir, '../../packages/react/package.json'), join(templateDir, REACT_MANIFEST_NAME)];

/**
 * @param {string} templateDir
 * @returns {string} the Tessera peer range of brock-react
 */
const tesseraRange = (templateDir) => {
  const file = manifestCandidates(templateDir).find((candidate) => existsSync(candidate));
  if (!file) throw new Error(`No brock-react manifest near ${templateDir}`);
  const range = JSON.parse(readFileSync(file, 'utf8')).peerDependencies?.[TESSERA];
  if (!range) throw new Error(`brock-react declares no ${TESSERA} peer range`);
  return range;
};

export { REACT_MANIFEST_NAME, TESSERA, tesseraRange };
