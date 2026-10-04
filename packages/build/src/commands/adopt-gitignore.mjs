/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const NOTE = [
  '# Every folder that needs ignoring is a dot-folder, and the .*/ line below',
  '# ignores them all, at any depth. A dot-folder the repo tracks gets a ! line',
  '# here. Never add a line for a single dot-folder: .*/ already covers it.',
];

const DOT_FOLDERS = '.*/';

const EXCEPTIONS = ['!.github/', '!.changeset/', '!.vscode/', '.vscode/*', '!.vscode/extensions.json', '!.brock/', '.brock/profile-config.json'];

const GENERATED = [
  'node_modules/',
  'dist/',
  'release/',
  '.brock-port-slot',
  '**/build/icons/',
  '**/build/splash/',
  '**/build/installer-splash.png',
  '**/public/logos/icon.svg',
  '**/public/logos/icon.ico',
  '**/public/logos/icon-256.png',
  '**/public/logos/icon-32.png',
  '**/public/logos/icon-24.png',
  '**/public/logos/icon-bot.svg',
  '**/public/logos/icon-bot.ico',
  '**/public/logos/icon-bot-256.png',
  '**/public/logos/mark.svg',
];

const SINGLE_DOT_FOLDER = /^(?:\/|\*\*\/)?(?:[^!#\s]\S*\/)?\.[^/\s*?[\]!]+\/(?:\*\*)?$/;

const trackedFiles = (rootDir) => {
  try {
    return execFileSync('git', ['ls-files', '-z'], { cwd: rootDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 }).split('\0').filter(Boolean);
  } catch {
    return [];
  }
};

const dotFoldersOf = (file) => {
  const parts = file.split('/').slice(0, -1);
  return parts.flatMap((part, i) => (part.startsWith('.') ? [parts.slice(0, i + 1).join('/')] : []));
};

const trackedExceptions = (rootDir) => {
  const covered = new Set(EXCEPTIONS);
  const folders = new Set(trackedFiles(rootDir).flatMap(dotFoldersOf));
  return [...folders].sort().map((folder) => `!${folder}/`).filter((line) => !covered.has(line));
};

const keptLines = (current) => current.split(/\r?\n/).filter((line) => !SINGLE_DOT_FOLDER.test(line.trim()));

const convention = (rootDir, present) => {
  const exceptions = [...EXCEPTIONS, ...trackedExceptions(rootDir)];
  if (!present.has(DOT_FOLDERS)) return [...NOTE, DOT_FOLDERS, ...exceptions];
  return exceptions.filter((line) => !present.has(line));
};

/**
 * @param {string} rootDir
 * @returns {string[]} the lines added to .gitignore
 */
const ignoreGenerated = (rootDir) => {
  const file = join(rootDir, '.gitignore');
  const current = existsSync(file) ? readFileSync(file, 'utf8') : '';
  const kept = keptLines(current);
  const present = new Set(kept.map((line) => line.trim()));
  const added = [...convention(rootDir, present), ...GENERATED.filter((line) => !present.has(line))];
  const dropped = kept.length !== current.split(/\r?\n/).length;
  if (!added.length && !dropped) return [];
  const body = kept.join('\n').replace(/\n*$/, '');
  writeFileSync(file, `${body ? `${body}\n` : ''}${added.join('\n')}\n`, 'utf8');
  return added;
};

export { ignoreGenerated };
