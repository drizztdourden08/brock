/* @layer tooling-scripts @kind logic */
import { cpSync, existsSync, globSync, mkdirSync, readdirSync } from 'node:fs';
import { isAbsolute, join, relative, resolve } from 'node:path';

const slash = (path) => path.replace(/\\/g, '/');

const filesUnder = (dir) => readdirSync(dir, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => slash(relative(dir, join(entry.parentPath, entry.name))));

const matchesOf = (pattern, root) => {
  const found = pattern.includes('*') ? globSync(pattern, { cwd: root }) : [pattern];
  return found.filter((path) => !isAbsolute(path) && !slash(path).startsWith('../') && existsSync(resolve(root, path)));
};

/**
 * @param {{ name: string, paths: string[], ifNoFiles: string }} upload
 * @param {{ root: string, dir: string }} place
 * @returns {{ pass: boolean, text: string, artifact: { name: string, dir: string, files: string[] } }}
 */
const copyArtifact = (upload, { root, dir }) => {
  const matches = upload.paths.filter((path) => !path.startsWith('!')).flatMap((path) => matchesOf(path, root));
  for (const path of matches) {
    mkdirSync(dir, { recursive: true });
    cpSync(resolve(root, path), join(dir, path), { recursive: true });
  }
  const files = existsSync(dir) ? filesUnder(dir) : [];
  const artifact = { name: upload.name, dir, files };
  if (files.length) return { pass: true, text: `Kept ${files.length} file(s) of the artifact "${upload.name}" in ${dir}.`, artifact };
  const text = `No file matched ${upload.paths.join(', ') || 'the path'} for the artifact "${upload.name}".`;
  return { pass: upload.ifNoFiles !== 'error', text, artifact };
};

export { copyArtifact };
