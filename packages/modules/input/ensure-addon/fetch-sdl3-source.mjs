/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { downloadVerified } from './download-verified.mjs';
import { extractArchive } from './extract-archive.mjs';

/**
 * @param {import('./index.d.mts').AddonJob} job
 * @returns {Promise<string>} the SDL3 source folder
 */
const fetchSdl3Source = async (job) => {
  const { sdl3Version } = job.pins;
  const name = `SDL3-${sdl3Version}.tar.gz`;
  const tarball = await downloadVerified(`https://github.com/libsdl-org/SDL/releases/download/release-${sdl3Version}/${name}`, name, job);
  const sourceDir = join(job.paths.thirdPartyDir, `SDL3-${sdl3Version}`);
  if (!extractArchive(tarball, job.paths.thirdPartyDir) || !existsSync(join(sourceDir, 'CMakeLists.txt'))) {
    throw new Error(`Expected ${sourceDir}/CMakeLists.txt after unpacking ${name}.`);
  }
  return sourceDir;
};

export { fetchSdl3Source };
