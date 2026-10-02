/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { BARREL_HEADER, EMPTY_MODULE } from './design.constants.mjs';
import { mergeImports } from './merge-imports.mjs';
import { packageJson } from './package-json.mjs';
import { pathInside } from './path-inside.mjs';

const byFile = (refs) => {
  const groups = new Map();
  for (const ref of refs) groups.set(ref.file, [...(groups.get(ref.file) ?? []), ref]);
  return groups;
};

const rewriteImporters = (moves, designName, touched) => {
  const movingDirs = moves.map((move) => move.compound.dir);
  const refs = moves.flatMap((move) => move.rewrites).filter((ref) => !movingDirs.some((dir) => pathInside(ref.file, dir)));
  for (const [file, found] of byFile(refs)) {
    let source = readFileSync(file, 'utf8');
    for (const ref of [...found].sort((a, b) => b.start - a.start)) source = `${source.slice(0, ref.start)}${designName}${source.slice(ref.end)}`;
    writeFileSync(file, mergeImports(source, designName), 'utf8');
    touched.push(file);
    const manifest = packageJson.nearestPackageJson(file);
    if (manifest && packageJson.addDependencies(manifest, { [designName]: 'workspace:*' })) touched.push(manifest);
  }
};

const barrelLines = ({ compound, exports }) => [
  ...(exports.values.length ? [`export { ${exports.values.join(', ')} } from './compounds/${compound.name}';`] : []),
  ...(exports.types.length ? [`export type { ${exports.types.join(', ')} } from './compounds/${compound.name}';`] : []),
];

const extendBarrel = (designDir, moves) => {
  const file = join(designDir, 'src', 'index.ts');
  const before = existsSync(file) ? readFileSync(file, 'utf8') : `${BARREL_HEADER}\n`;
  const lines = before.replace(/\r\n/g, '\n').split('\n').filter((line) => line.trim() !== EMPTY_MODULE && line.trim() !== '');
  const added = moves.flatMap(barrelLines).filter((line) => !lines.includes(line));
  writeFileSync(file, `${[...lines, ...added].join('\n')}\n`, 'utf8');
  return file;
};

/**
 * @param {{ designDir: string, designName: string, moves: { compound: { name: string, dir: string }, deps: Record<string, string>, rewrites: { file: string, start: number, end: number }[], exports: { values: string[], types: string[] } }[] }} input
 * @returns {{ touched: string[], moved: { from: string, to: string }[] }} absolute paths
 */
const moveCompounds = ({ designDir, designName, moves }) => {
  if (moves.length === 0) return { touched: [], moved: [] };
  const touched = [];
  const moved = [];
  rewriteImporters(moves, designName, touched);
  for (const move of moves) {
    const target = join(designDir, 'src', 'compounds', move.compound.name);
    renameSync(move.compound.dir, target);
    touched.push(target);
    moved.push({ from: move.compound.dir, to: target });
  }
  touched.push(extendBarrel(designDir, moves));
  const manifest = join(designDir, 'package.json');
  if (packageJson.addDependencies(manifest, Object.assign({}, ...moves.map((move) => move.deps)))) touched.push(manifest);
  return { touched, moved };
};

export { moveCompounds };
