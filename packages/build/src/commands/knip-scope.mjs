/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

const CONFIG_FILES = ['knip.json', '.knip.json'];
const OWN_SCOPE_FLAGS = ['--workspace', '-W'];

const workspacesOf = (dir) => {
  const name = CONFIG_FILES.find((file) => existsSync(join(dir, file)));
  if (!name) return {};
  return JSON.parse(readFileSync(join(dir, name), 'utf8')).workspaces ?? {};
};

const scopesItself = (args) => args.some((arg) => OWN_SCOPE_FLAGS.some((flag) => arg === flag || arg.startsWith(`${flag}=`)));

/**
 * @param {string} dir the folder knip was started in
 * @param {string[]} args the knip arguments
 * @returns {{ rootDir: string, args: string[] }} the repo above with `--workspace`, else the inputs
 */
const knipScope = (dir, args) => {
  if (scopesItself(args)) return { rootDir: dir, args };
  for (let up = dirname(dir); up !== dirname(up); up = dirname(up)) {
    const member = relative(up, dir).replace(/\\/g, '/');
    if (member in workspacesOf(up)) return { rootDir: up, args: ['--workspace', member, ...args] };
  }
  return { rootDir: dir, args };
};

export { knipScope };
