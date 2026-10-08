/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { checkNoteFile, compareVersions } from '@drizztdourden08/brock-thread';
import { CONFIG_FILE } from '../config.mjs';
import { loadBrockConfig } from '../load-config.mjs';
import { NOTES_DIR } from '../packaging/packaging.constants.mjs';
import { releaseAppDir } from '../release/release-app-dir.mjs';
import { releaseLayout } from '../release/release-layout.mjs';
import { findWorkspaceRoot } from '../workspace.mjs';

const USAGE = `brock release-notes check [version]
  the note of the version being released, release-notes/v<version>.md at the repo root (in the app folder when
  the repo releases several apps): the title names the product, a one-paragraph summary, ## sections,
  plain-English bullets. Without a version, the app's own version once the repo has a note at or below it.
  The format: @drizztdourden08/standards docs/release-notes.md`;

const NOTE_FILE = /^v(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)\.md$/;

/**
 * @param {string} rootDir an app root or a repo root
 * @returns {string | null} the app the notes are for
 */
const appRootOf = (rootDir) => {
  if (existsSync(join(rootDir, CONFIG_FILE))) return rootDir;
  const appDir = join(rootDir, releaseAppDir(rootDir));
  return existsSync(join(appDir, CONFIG_FILE)) ? appDir : null;
};

/**
 * @param {string} appDir
 * @param {{ releaseTagPrefix?: string }} product
 * @returns {string} the folder that holds release-notes/
 */
const notesRootOf = (appDir, product) => {
  const layout = releaseLayout(appDir, product);
  if (layout) return layout.app ? appDir : layout.repoDir;
  return findWorkspaceRoot(appDir) ?? appDir;
};

const started = (notesRoot, version) => {
  const dir = join(notesRoot, NOTES_DIR);
  if (!existsSync(dir)) return false;
  return readdirSync(dir).some((name) => NOTE_FILE.test(name) && compareVersions(NOTE_FILE.exec(name)[1], version) <= 0);
};

/**
 * @param {{ rootDir: string, args: string[] }} ctx
 * @returns {Promise<number>} exit code
 */
const runReleaseNotes = async ({ rootDir, args }) => {
  const [command, given] = args;
  if (command !== 'check') {
    console.log(USAGE);
    return command === 'help' ? 0 : 1;
  }
  const appDir = appRootOf(rootDir);
  if (!appDir) throw new Error(`No Brock app in ${rootDir}. A library checks its notes with standards release-notes check.`);
  const { product } = await loadBrockConfig(appDir);
  const notesRoot = notesRootOf(appDir, product);
  const version = given ?? JSON.parse(readFileSync(join(appDir, 'package.json'), 'utf8')).version;
  if (!given && !started(notesRoot, version)) {
    console.log(`brock release-notes: no note at or below v${version} yet; the next release needs ${NOTES_DIR}/v<version>.md.`);
    return 0;
  }
  const findings = checkNoteFile({ rootDir: notesRoot, version, product: product.name });
  for (const finding of findings) console.error(finding);
  console.log(`brock release-notes: ${NOTES_DIR}/v${version.replace(/^v/, '')}.md, ${findings.length} finding(s).`);
  return findings.length ? 1 : 0;
};

export { runReleaseNotes };
