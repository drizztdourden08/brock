/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { writeFileAtomic } from '../local/atomic-write.mjs';
import { stop } from '../release/local/release-stop.mjs';
import { digestOf } from '../release/local/release-store.mjs';
import { attempt, lastLine } from './replay-exec.mjs';
import { tagOf } from './replay-plan.mjs';

const MANIFEST = 'release.json';

const digestOrNull = (file) => {
  try {
    return digestOf(file);
  } catch {
    return null;
  }
};

/**
 * @param {object} item a release plan item
 * @returns {void} throws a stop when a tarball differs from release.json
 */
const verifyTarballs = (item) => {
  for (const pkg of item.packages) {
    const actual = digestOrNull(pkg.file);
    if (!actual) throw stop(`${pkg.file} cannot be read, so ${pkg.name}@${pkg.version} is not published.`, 1);
    if (actual.sha512 !== pkg.sha512 || (pkg.sha256 && actual.sha256 !== pkg.sha256)) {
      throw stop(`${pkg.tarball} does not match the sha512 in release.json. The bytes changed after the release was cut; nothing is published.`, 1);
    }
  }
};

/**
 * @param {object} item a release plan item
 * @param {{ state: string, at: string, url: string | null }} replay
 * @returns {void} release.json is rewritten whole: temp file, rename
 */
const recordRelease = (item, replay) => {
  const file = join(item.release.dir, MANIFEST);
  const manifest = JSON.parse(readFileSync(file, 'utf8'));
  writeFileAtomic(file, `${JSON.stringify({ ...manifest, replay }, null, 2)}\n`);
};

const publishPackage = ({ pkg, exec, cwd, log }) => {
  const label = `${pkg.name}@${pkg.version}`;
  const existing = attempt(exec, 'npm', ['view', label, 'dist.integrity', '--registry', pkg.registry], cwd);
  if (existing === `sha512-${pkg.sha512}`) return log(`  ${label} is on ${pkg.registry} with the same integrity. Not published again.`);
  if (existing) throw stop(`${label} is on ${pkg.registry} with a different integrity (${existing}). Hard stop: nothing was changed.`, 1);
  exec('npm', ['publish', pkg.file, '--registry', pkg.registry], { cwd });
  return log(`  published ${label}`);
};

const createRelease = ({ item, exec, cwd, log }) => {
  const tag = tagOf(item.release);
  const existing = lastLine(attempt(exec, 'gh', ['release', 'view', tag, '--json', 'url', '--jq', '.url'], cwd));
  if (existing) {
    log(`  GitHub release ${tag} exists already.`);
    return existing;
  }
  const title = item.release.title ?? tag;
  const args = ['release', 'create', tag, ...item.assets, '--notes-file', item.notes, '--title', title];
  if (item.release.commit) args.push('--target', item.release.commit);
  return lastLine(exec('gh', args, { cwd }));
};

const fail = (item, error) => {
  recordRelease(item, { state: 'failed', at: new Date().toISOString(), url: null });
  return error;
};

/**
 * @param {object} item a release plan item
 * @param {{ exec: Function, cwd: string, log: (line: string) => void }} context
 * @returns {{ url: string | null }} the release is published and recorded done
 */
const replayRelease = (item, { exec, cwd, log }) => {
  try {
    verifyTarballs(item);
    for (const pkg of item.packages) publishPackage({ pkg, exec, cwd, log });
    const url = createRelease({ item, exec, cwd, log });
    recordRelease(item, { state: 'done', at: new Date().toISOString(), url });
    return { url };
  } catch (error) {
    throw fail(item, error);
  }
};

export { replayRelease, verifyTarballs };
