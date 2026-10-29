/* @layer tooling-scripts @kind logic */
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { gitAt, tryGitAt } from '../../git.mjs';
import { stop } from './release-stop.mjs';

const manifestAt = (cwd, base, file) => {
  const text = tryGitAt(['show', `${base}:${file}`], cwd);
  return text ? JSON.parse(text) : null;
};

const manifestNow = (cwd, file) => {
  const path = join(cwd, file);
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null;
};

/**
 * @param {{ cwd: string, base: string }} input base is the integration commit the release was cut from
 * @returns {{ name: string, version: string, dir: string }[]} the public packages whose version moved since base
 */
const changedPackages = ({ cwd, base }) => {
  const files = gitAt(['diff', '--name-only', base, 'HEAD'], cwd).split('\n').filter((file) => file.endsWith('package.json'));
  return files.flatMap((file) => {
    const now = manifestNow(cwd, file);
    const before = manifestAt(cwd, base, file);
    const moved = now && !now.private && now.name && now.version !== before?.version;
    return moved ? [{ name: now.name, version: now.version, dir: join(cwd, dirname(file)) }] : [];
  });
};

/**
 * @param {{ packages: { name: string, version: string, dir: string }[], stage: string, exec: Function }} input
 * @returns {{ name: string, version: string, file: string, tarball: string }[]} one tarball per package
 */
const packAll = ({ packages, stage, exec }) =>
  packages.map((pkg, index) => {
    const dest = join(stage, String(index));
    mkdirSync(dest, { recursive: true });
    exec('pnpm', ['pack', '--pack-destination', dest], { cwd: pkg.dir });
    const tarball = readdirSync(dest).find((name) => name.endsWith('.tgz'));
    if (!tarball) throw stop(`pnpm pack made no .tgz for ${pkg.name}.`, 1);
    return { name: pkg.name, version: pkg.version, file: join(dest, tarball), tarball };
  });

export { changedPackages, packAll };
