/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, join, relative, resolve } from 'node:path';
import { pathInside } from '../design/path-inside.mjs';
import { ownedFiles } from '../owned-files.mjs';
import { installedTessera } from '../tessera/installed-tessera.mjs';
import { loadTypescript } from '../tessera/load-typescript.mjs';
import { releaseOverlay } from '../tessera/release-overlay.mjs';
import { selectReleases } from '../tessera/select-releases.mjs';
import { tesseraPin } from '../tessera/tessera-pin.mjs';
import { tesseraRenamesStep } from '../tessera/tessera-renames-step.mjs';
import { GENERATED_MARK, TESSERA_PACKAGE } from '../tessera/tessera-renames.constants.mjs';
import { copyAttributes } from './copy-attributes.mjs';
import { copyImports } from './copy-imports.mjs';
import { copyLeftovers } from './copy-leftovers.mjs';
import { copyNames } from './copy-names.mjs';
import { copyStyles } from './copy-styles.mjs';
import { entryCheck } from './entry-check.mjs';
import { entryExports } from './entry-exports.mjs';
import { COPY_CHECK_ID, COPY_FIRST_RELEASE_AFTER, COPY_OVERLAY, COPY_SCRIPT, COPY_SOURCE, COPY_STEP_ID, COPY_STYLE, TESSERA_MENTION } from './tessera-copy.constants.mjs';

const refusalOf = ({ copyDir, tessera, ts }) => {
  if (!existsSync(copyDir) || !statSync(copyDir).isDirectory()) return `the copy folder ${copyDir} does not exist`;
  if (!tessera) return `${TESSERA_PACKAGE} is not installed. Add it to the app first: its RENAMES.json drives the conversion.`;
  if (!tessera.releases) return `the installed ${TESSERA_PACKAGE} ${tessera.version} has no RENAMES.json`;
  return ts ? null : 'TypeScript is not installed, and the conversion reads every import with it.';
};

const scopeOf = (rootDir, copyDir) =>
  ownedFiles(rootDir)
    .filter((path) => COPY_SOURCE.test(path))
    .map((path) => ({ path, file: join(rootDir, path) }))
    .filter(({ file }) => !pathInside(file, copyDir))
    .map((item) => ({ ...item, source: readFileSync(item.file, 'utf8') }))
    .filter(({ source }) => !GENERATED_MARK.test(source.slice(0, 300)));

const convertOne = (ts, { file, source }, copy) => {
  const input = { path: file, source };
  if (!copy.needles.some((needle) => source.includes(needle))) return { source, converted: false, todos: [] };
  if (COPY_STYLE.test(file)) return { source, converted: false, todos: copyStyles(input, copy) };
  const result = copyImports(ts, input, copy);
  return result.converted ? { ...result, source: copyAttributes(ts, { path: file, source: result.source }) } : result;
};

const convertAll = (ts, scope, copy) => {
  const converted = [];
  const todos = [];
  for (const item of scope) {
    const result = convertOne(ts, item, copy);
    if (result.source !== item.source) writeFileSync(item.file, result.source, 'utf8');
    if (result.converted) converted.push(item);
    todos.push(...result.todos.map((todo) => ({ file: item.path, ...todo })));
  }
  return { converted, todos };
};

const replayScope = (scope, converted, first) => {
  const done = new Set(converted.map(({ file }) => file));
  const fresh = ({ path, source }) => !(COPY_SCRIPT.test(path) && TESSERA_MENTION.test(source));
  return scope.filter((item) => done.has(item.file) || (first && fresh(item))).map(({ file }) => file);
};

const checkAll = (ts, converted, known) => {
  const touched = [];
  const todos = [];
  for (const { file, path } of converted) {
    const source = readFileSync(file, 'utf8');
    const result = entryCheck(ts, { path: file, source }, known);
    if (result.source !== source) {
      writeFileSync(file, result.source, 'utf8');
      touched.push(path);
    }
    todos.push(...result.todos.map((todo) => ({ file: path, ...todo })));
  }
  return { touched, todos };
};

const knownOf = (ts, tessera) => {
  const releases = selectReleases(tessera.releases, { from: COPY_FIRST_RELEASE_AFTER, to: tessera.version }).map((release) => releaseOverlay(release, COPY_OVERLAY));
  const exports = entryExports(ts, tessera.dir);
  return { exports, ...copyNames(releases, exports), version: tessera.version };
};

const entry = (id, version, { summary, touched, todos }) => ({ id, version, source: TESSERA_PACKAGE, summary, touched, todos });

/**
 * @param {{ rootDir: string, copy: string, aliases?: string[] }} ctx copy: a folder, from rootDir
 * @returns {{ refused: string } | ReturnType<typeof tesseraRenamesStep>} rewrite, renames, check
 */
const tesseraCopyStep = ({ rootDir, copy, aliases = [] }) => {
  const copyDir = resolve(rootDir, copy);
  const tessera = installedTessera(rootDir);
  const ts = loadTypescript(rootDir);
  const refused = refusalOf({ copyDir, tessera, ts });
  if (refused) return { refused };
  const first = tesseraPin.read(rootDir) === null;
  const scope = scopeOf(rootDir, copyDir);
  const place = { copyDir, aliases, needles: [...aliases, basename(copyDir)] };
  const conversion = convertAll(ts, scope, place);
  const replay = tesseraRenamesStep({ rootDir, from: COPY_FIRST_RELEASE_AFTER, files: replayScope(scope, conversion.converted, first), overlay: COPY_OVERLAY });
  const check = checkAll(ts, conversion.converted, knownOf(ts, tessera));
  const folder = relative(rootDir, copyDir).replace(/\\/g, '/');
  return {
    ...replay,
    applied: [
      entry(COPY_STEP_ID, tessera.version, { summary: `Named imports of ${folder} now name Tessera entry points.`, touched: conversion.converted.map(({ path }) => path), todos: conversion.todos }),
      ...replay.applied,
      entry(COPY_CHECK_ID, tessera.version, { summary: 'Every name the converted files import is checked against the installed Tessera.', touched: check.touched, todos: [...check.todos, ...copyLeftovers(rootDir, place)] }),
    ],
  };
};

export { tesseraCopyStep };
