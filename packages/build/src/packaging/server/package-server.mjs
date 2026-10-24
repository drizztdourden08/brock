/* @layer tooling-scripts @kind logic */
import { mkdirSync, readFileSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { serverOptions } from '../../platforms/server/server-options.mjs';
import { SERVER_ARCHES } from '../../platforms/server/server.constants.mjs';
import { artifactPrefixOf } from '../release-names.mjs';
import { dpkgDeb } from './dpkg-deb.mjs';
import { downloadBytes } from './download-bytes.mjs';
import { fetchNodeBinary } from './fetch-node.mjs';
import { SERVER_RELEASE_DIR } from './server-packaging.constants.mjs';
import { stageServer } from './stage-server.mjs';
import { writeDeb } from './write-deb.mjs';
import { writeDockerContext } from './write-docker-context.mjs';
import { writeTarball } from './write-tarball.mjs';

const NO_DPKG = 'brock server package --deb needs dpkg-deb, which this machine does not have. Run it on Linux (sudo apt-get install -y dpkg-dev), or leave --deb out for the tarball and the Docker context.';

const defaultDeps = () => ({ download: downloadBytes, cacheDir: join(homedir(), '.brock', 'cache', 'node'), dpkg: dpkgDeb() });

/**
 * @param {{ rootDir: string, config: import('../../config.mjs').BrockConfig, arches?: ('x64' | 'arm64')[], deb?: boolean, deps?: Partial<ReturnType<typeof defaultDeps>> }} request
 * @returns {Promise<{ tarballs: string[], debs: string[], dockerDir: string, image: string | null, version: string }>} what was written under release/server
 */
const packageServer = async ({ rootDir, config, arches, deb = false, deps = {} }) => {
  const { download, cacheDir, dpkg, pins } = { ...defaultDeps(), ...deps };
  if (deb && !dpkg.available()) throw new Error(NO_DPKG);
  const options = serverOptions(config);
  const { product } = config;
  const version = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8')).version;
  const prefix = artifactPrefixOf(product);
  const outDir = join(rootDir, SERVER_RELEASE_DIR);
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  const built = [];
  for (const arch of arches ?? options.arch) {
    const node = await fetchNodeBinary({ version: options.node, arch, cacheDir, download, pins });
    const entries = stageServer({ rootDir, id: product.id, node });
    const tarball = writeTarball({ outDir, prefix, arch, entries });
    const debFile = deb ? writeDeb({ rootDir, outDir, prefix, arch: { name: arch, deb: SERVER_ARCHES[arch].deb }, version, product, osPackages: options.osPackages, entries, runDpkg: dpkg.run }) : null;
    built.push({ arch, tarball, debFile });
  }
  const dockerDir = writeDockerContext({ rootDir, outDir, tarballs: built.map(({ arch, tarball }) => ({ arch, file: tarball })) });
  return { tarballs: built.map(({ tarball }) => tarball), debs: built.flatMap(({ debFile }) => (debFile ? [debFile] : [])), dockerDir, image: options.image, version };
};

export { packageServer };
