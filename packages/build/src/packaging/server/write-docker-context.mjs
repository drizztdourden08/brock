/* @layer tooling-scripts @kind logic */
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { SERVER_ARCHES, SERVER_DOCKERFILE } from '../../platforms/server/server.constants.mjs';
import { DOCKER_CONTEXT_DIR } from './server-packaging.constants.mjs';
import { readManagedFile } from './read-managed-file.mjs';

/**
 * @param {{ rootDir: string, outDir: string, tarballs: { arch: 'x64' | 'arm64', file: string }[] }} spec
 * @returns {string} the context folder: Dockerfile and the bundles
 */
const writeDockerContext = ({ rootDir, outDir, tarballs }) => {
  const dir = join(outDir, DOCKER_CONTEXT_DIR);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'Dockerfile'), readManagedFile(rootDir, SERVER_DOCKERFILE));
  for (const { arch, file } of tarballs) copyFileSync(file, join(dir, `bundle-${SERVER_ARCHES[arch].docker}.tar.gz`));
  return dir;
};

export { writeDockerContext };
