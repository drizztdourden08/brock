/* @layer tooling-scripts @kind logic */
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { findWorkspaceRoot } from '../../src/workspace.mjs';

const NOTES_DIR = 'release-notes';
const NOTE_FILE = /^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?\.md$/;
const README = 'README.md';
const WORKFLOWS = ['.github/workflows/ci.yml', '.github/workflows/release.yml'];

const README_TEXT = `<!-- @layer docs @kind doc -->
# Release notes

One file per release, \`v<version>.md\`, written for the people who use the app. It is the body of the GitHub release, and the updater shows it before an update. The release workflow refuses a version without one, and \`brock release-notes check <version>\` runs the same check.

The first line is \`# <product name> v<version>\`, then one paragraph that sums the release up, then \`##\` sections (New, Changes, View, Settings, Around the app, Platforms, Under the hood, Upgrading, Fixes) of \`-\` bullets, each a plain sentence. The full format is \`docs/release-notes.md\` in \`@drizztdourden08/standards\`.
`;

const slashed = (path) => path.replace(/\\/g, '/');

const hasNotes = (dir) => existsSync(dir) && readdirSync(dir).some((name) => NOTE_FILE.test(name) || name === README);

const workflowTodos = (rootDir, repoDir) => {
  if (repoDir === rootDir) return [];
  return WORKFLOWS.filter((file) => existsSync(join(repoDir, file))).map((file) => ({
    file: slashed(relative(rootDir, join(repoDir, file))),
    line: null,
    message: 'brock sync keeps this workflow at the repo root now, from brock.config.ts. Move any step of your own into a module ci step or another workflow file before the next sync replaces it.',
  }));
};

const workspace = ({ rootDir }) => {
  const repoDir = findWorkspaceRoot(rootDir) ?? rootDir;
  const dir = join(repoDir, NOTES_DIR);
  const todos = workflowTodos(rootDir, repoDir);
  if (hasNotes(dir)) return { touched: [], todos };
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, README), README_TEXT, 'utf8');
  const label = slashed(relative(rootDir, join(dir, README)));
  todos.push({ file: label, line: null, message: 'Write release-notes/v<version>.md for the next release before you run it; the release workflow stops without it.' });
  return { touched: [label], todos };
};

const migration = Object.freeze({
  id: 'release-notes-folder',
  summary: 'Every release has a note, release-notes/v<version>.md at the repo root, in the release note standard; the release workflow checks it with brock release-notes check before it tags, makes it the release body and packs it for the updater. The migration adds the folder with a README on the format, and an app inside a workspace gets its ci.yml and release.yml from brock sync at the repo root.',
  workspace,
});

export { migration };
