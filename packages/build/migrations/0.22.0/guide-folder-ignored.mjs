/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { findWorkspaceRoot } from '../../src/workspace.mjs';

const CONFIG = 'tessera.config.json';
const IGNORE = '.gitignore';
const DEFAULT_OUT = 'guide';

const configDirOf = (rootDir) => (existsSync(join(rootDir, CONFIG)) ? rootDir : findWorkspaceRoot(rootDir) ?? rootDir);

const outsOf = (configDir) => {
  try {
    const config = JSON.parse(readFileSync(join(configDir, CONFIG), 'utf8'));
    const own = typeof config?.guide?.out === 'string' ? config.guide.out : DEFAULT_OUT;
    const apps = Object.values(config?.apps ?? {}).flatMap((entry) => (typeof entry?.guide?.out === 'string' ? [entry.guide.out] : []));
    return [...new Set([own, ...apps].map((out) => out.replace(/\\/g, '/').replace(/^\.\//, '').replace(/\/+$/, '')).filter(Boolean))];
  } catch {
    return [];
  }
};

const covers = (lines, out) => lines.some((line) => [out, `${out}/`, `/${out}`, `/${out}/`].includes(line.trim()));

const tracked = (configDir, out) => {
  try {
    return execFileSync('git', ['ls-files', '--', out], { cwd: configDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() !== '';
  } catch {
    return false;
  }
};

const workspace = ({ rootDir }) => {
  const configDir = configDirOf(rootDir);
  if (!existsSync(join(configDir, CONFIG))) return {};
  const file = join(configDir, IGNORE);
  const label = relative(rootDir, file).replace(/\\/g, '/') || IGNORE;
  const source = existsSync(file) ? readFileSync(file, 'utf8') : '';
  const eol = source.includes('\r\n') ? '\r\n' : '\n';
  const outs = outsOf(configDir);
  const missing = outs.filter((out) => !covers(source.split(/\r?\n/), out));
  const touched = [];
  if (missing.length > 0) {
    const body = source.length === 0 || source.endsWith('\n') ? source : `${source}${eol}`;
    writeFileSync(file, `${body}${missing.map((out) => `/${out}/`).join(eol)}${eol}`, 'utf8');
    touched.push(label);
  }
  const todos = outs.filter((out) => tracked(configDir, out)).map((out) => ({
    file: label, line: null, message: `tessera guide writes ${out}/ on every brock sync, so git ignores it now, but this repo still tracks it. Run git rm -r --cached ${out} once.`,
  }));
  return { touched, todos };
};

const migration = Object.freeze({
  id: 'guide-folder-ignored',
  summary: 'The guide/ folder tessera guide writes is generated output: brock sync, dev, build and start write it again before it is needed, so the .gitignore beside tessera.config.json ignores it (/guide/, or the guide.out folders), and a tracked copy becomes a to-do.',
  workspace,
});

export { migration };
