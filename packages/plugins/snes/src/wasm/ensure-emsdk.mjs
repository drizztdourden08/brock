/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const pinnedVersion = (main) => {
  const version = JSON.parse(readFileSync(join(main, 'package.json'), 'utf8')).config?.emsdk;
  if (!version) throw new Error('package.json has no "config": { "emsdk": "<version>" } pin.');
  return version;
};

const installedVersion = (dir) => {
  const file = join(dir, 'upstream', 'emscripten', 'emscripten-version.txt');
  if (!existsSync(file) || !existsSync(join(dir, '.emscripten'))) return null;
  return readFileSync(file, 'utf8').trim().replace(/"/g, '');
};

const emsdkCommand = (dir, args) => {
  const opts = { cwd: dir, stdio: 'inherit' };
  if (process.platform === 'win32') execFileSync('cmd', ['/d', '/c', join(dir, 'emsdk.bat'), ...args], opts);
  else execFileSync(join(dir, 'emsdk'), args, opts);
};

const fetchSdk = (dir, repo) => {
  if (existsSync(join(dir, 'emsdk.py'))) {
    execFileSync('git', ['pull', '--ff-only'], { cwd: dir, stdio: 'inherit' });
    return;
  }
  mkdirSync(dirname(dir), { recursive: true });
  execFileSync('git', ['clone', '--depth', '1', repo, dir], { stdio: 'inherit' });
};

/**
 * @param {{ main: string, dir: string, repo: string, log: (message: string) => void }} request
 * @returns {string} the SDK directory
 */
const ensureEmsdk = ({ main, dir, repo, log }) => {
  const version = pinnedVersion(main);
  const installed = installedVersion(dir);
  if (installed === version) {
    log(`Emscripten ${version} is installed at ${dir}.`);
    return dir;
  }
  log(installed ? `Emscripten ${installed} found, the repo pins ${version}. Updating.` : `Installing Emscripten ${version} into ${dir}.`);
  fetchSdk(dir, repo);
  emsdkCommand(dir, ['install', version]);
  emsdkCommand(dir, ['activate', version]);
  const now = installedVersion(dir);
  if (now !== version) throw new Error(`Install finished but ${dir} reports ${now ?? 'nothing'}, expected ${version}.`);
  log(`Emscripten ${version} installed.`);
  return dir;
};

export { ensureEmsdk };
