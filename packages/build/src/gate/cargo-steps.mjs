/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { CLIPPY_CONFIG_FILES, CLIPPY_DEFAULT_DIR, CLIPPY_LINTS } from './cargo.constants.mjs';
import { findCargo } from './find-cargo.mjs';

const clippyEnv = (root) => (CLIPPY_CONFIG_FILES.some((file) => existsSync(join(root, file))) ? {} : { CLIPPY_CONF_DIR: CLIPPY_DEFAULT_DIR });

const label = (appDir, root) => {
  const where = relative(appDir, root).replace(/\\/g, '/');
  return where ? ` (in ${where})` : '';
};

/**
 * @param {{ appDir: string, root: string, clippyArgs?: string[], env?: NodeJS.ProcessEnv }} opts
 * @returns {import('./gate-steps.mjs').GateStep[]} the comment check, fmt, clippy and test
 */
const cargoSteps = ({ appDir, root, clippyArgs = [], env = process.env }) => {
  const where = label(appDir, root);
  const comments = { kind: 'rust-comments', name: `rust comment check${where}`, dir: root };
  const command = findCargo(env);
  if (!command) return [comments, { kind: 'cargo-missing', name: `cargo (not on PATH)${where}`, dir: root }];
  const step = (words, extra = {}) => ({ kind: 'cargo', name: `cargo ${words.join(' ')}${where}`, dir: root, command, args: words, ...extra });
  return [
    comments,
    step(['fmt', '--all', '--', '--check']),
    step(['clippy', '--workspace', '--all-targets', '--', ...CLIPPY_LINTS, ...clippyArgs], { env: clippyEnv(root) }),
    step(['test', '--workspace']),
  ];
};

export { cargoSteps };
