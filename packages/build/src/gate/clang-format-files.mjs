/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { findWorkspaceRoot } from '../workspace.mjs';
import { CLANG_FORMAT_FILE, CLANG_FORMAT_TEMPLATE } from './gate.constants.mjs';

const TEMPLATE = join(import.meta.dirname, '..', 'managed', CLANG_FORMAT_TEMPLATE);

/**
 * @param {string} appDir the app root
 * @returns {string} the workspace root, else the app
 */
const repoRootOf = (appDir) => findWorkspaceRoot(appDir) ?? appDir;

/**
 * @param {string} appDir the app root
 * @param {{ gate?: { clangFormat?: string[] } }} config brock.config.ts
 * @returns {{ path: string, content: string }[]} .clang-format at the repo root, or none
 */
const clangFormatFiles = (appDir, config) => {
  if (!config.gate?.clangFormat?.length) return [];
  const path = relative(appDir, join(repoRootOf(appDir), CLANG_FORMAT_FILE)).replace(/\\/g, '/');
  return [{ path, content: readFileSync(TEMPLATE, 'utf8').replace(/\r\n/g, '\n') }];
};

export { clangFormatFiles, repoRootOf };
