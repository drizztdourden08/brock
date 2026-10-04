/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { findWorkspaceRoot } from '../../src/workspace.mjs';

const CONFIG = 'eslint.config.mjs';
const IGNORE = "'**/.brock/**'";
const COVERED = /\.brock\/\*\*/;
const IGNORES = /\bignores\s*:\s*\[/;
const CALL = /\b(brockEslint|standardsEslint)\(\s*\{/;

const withIgnore = (source) => {
  const list = IGNORES.exec(source);
  if (list) return `${source.slice(0, list.index + list[0].length)}${IGNORE}, ${source.slice(list.index + list[0].length)}`;
  const call = CALL.exec(source);
  if (call) return `${source.slice(0, call.index + call[0].length)} ignores: [${IGNORE}],${source.slice(call.index + call[0].length)}`;
  return null;
};

const configsOf = (rootDir) => {
  const workspaceRoot = findWorkspaceRoot(rootDir);
  return [...new Set([rootDir, ...(workspaceRoot ? [workspaceRoot] : [])])].map((dir) => join(dir, CONFIG)).filter((file) => existsSync(file));
};

const workspace = ({ rootDir }) => {
  const touched = [];
  const todos = [];
  for (const file of configsOf(rootDir)) {
    const source = readFileSync(file, 'utf8');
    if (COVERED.test(source)) continue;
    const label = relative(rootDir, file).replace(/\\/g, '/') || CONFIG;
    const next = withIgnore(source);
    if (next === null) todos.push({ file: label, line: null, message: `add ${IGNORE} to the ignores of this ESLint config, so the generated .brock files are not linted` });
    else {
      writeFileSync(file, next, 'utf8');
      touched.push(label);
    }
  }
  return { touched, todos };
};

const migration = Object.freeze({
  id: 'eslint-brock-ignore',
  summary: 'The generated .brock files are committed but never linted: the ESLint config of the app, and of the workspace root above it, gets **/.brock/** in its ignores, which also covers apps in subfolders. brockEslint now ignores it by default too.',
  workspace,
});

export { migration };
