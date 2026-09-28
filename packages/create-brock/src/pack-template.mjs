/* @layer tooling-scripts @kind logic */
import { copyFileSync, renameSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { copyTemplate } from './template.mjs';

const PACKAGE_DIR = resolve(import.meta.dirname, '..');
const REPO_DIR = resolve(PACKAGE_DIR, '../..');
const PACKED = join(PACKAGE_DIR, 'template');

rmSync(PACKED, { recursive: true, force: true });
copyTemplate(join(REPO_DIR, 'templates', 'app'), PACKED);
renameSync(join(PACKED, '.gitignore'), join(PACKED, '_gitignore'));
copyFileSync(join(REPO_DIR, 'pnpm-workspace.yaml'), join(PACKED, 'pnpm-workspace.yaml'));
