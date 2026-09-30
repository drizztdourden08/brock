/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { KIND_SUFFIXES, KINDS_AT, META_EXPORT, MISPLACED, NAMING_HINT, SCREEN_ID, SCREENS_CONFIG, SCREENS_DIR, SEARCH_ENTRIES_EXPORT } from './screen-conventions.constants.mjs';
import { layoutFindings } from './layout-findings.mjs';

/**
 * @typedef {{ kind: string, id: string, path: string, bucket?: string, group?: string, page?: string, hasMeta: boolean, hasSearchEntries: boolean }} ScreenFile
 * @typedef {{ level: 'root' | 'bucket' | 'group' | 'page', bucket?: string, group?: string, page?: string }} Place
 * @typedef {{ rootDir: string, files: ScreenFile[], findings: string[], buckets: string[] }} ScanState
 */

/** @param {string} name */
const classify = (name) => {
  const match = KIND_SUFFIXES.find(({ suffix }) => name.endsWith(suffix));
  return match ? { kind: match.kind, id: name.slice(0, -match.suffix.length) } : null;
};

/** @param {string} dir */
const entriesOf = (dir) => readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));

/** @param {string} dir */
const holdsTabs = (dir) => entriesOf(dir).some((entry) => entry.isFile() && entry.name.endsWith('.tab.tsx'));

/** @param {{ kind: string, id: string } | null} found @param {Place} place */
const problemWith = (found, place) => {
  if (!found) return `unknown screen file; ${NAMING_HINT}`;
  if (KINDS_AT[place.level].includes(found.kind)) return SCREEN_ID.test(found.id) ? null : `"${found.id}" is not a kebab-case id`;
  return place.level === 'page' ? 'a page folder holds only <tab>.tab.tsx files' : MISPLACED[found.kind];
};

/** @param {ScanState} state @param {string} rel @param {string} name @param {Place} place */
const addFile = (state, rel, name, place) => {
  const found = classify(name);
  const problem = problemWith(found, place);
  if (problem || !found) {
    state.findings.push(`${rel}: ${problem}`);
    return;
  }
  const source = readFileSync(join(state.rootDir, rel), 'utf8');
  const exports = { hasMeta: META_EXPORT.test(source), hasSearchEntries: SEARCH_ENTRIES_EXPORT.test(source) };
  state.files.push({ ...found, bucket: place.bucket, group: place.group, page: place.page, path: rel, ...exports });
};

/** @param {ScanState} state @param {string} rel @param {string} name @param {Place} place */
const childPlace = (state, rel, name, place) => {
  if (place.level === 'root') return { level: 'bucket', bucket: name };
  if (place.level !== 'page' && holdsTabs(join(state.rootDir, rel))) return { ...place, level: 'page', page: name };
  return place.level === 'bucket' ? { ...place, level: 'group', group: name } : null;
};

/** @param {ScanState} state @param {string} relDir @param {Place} place */
const scanDir = (state, relDir, place) => {
  for (const entry of entriesOf(join(state.rootDir, relDir))) {
    const rel = `${relDir}/${entry.name}`;
    if (entry.isDirectory()) scanFolder(state, rel, entry.name, place);
    else if (place.level !== 'root' || entry.name !== SCREENS_CONFIG) addFile(state, rel, entry.name, place);
  }
};

/** @param {ScanState} state @param {string} rel @param {string} name @param {Place} place */
const scanFolder = (state, rel, name, place) => {
  const next = SCREEN_ID.test(name) ? childPlace(state, rel, name, place) : null;
  if (!SCREEN_ID.test(name)) state.findings.push(`${rel}: "${name}" is not a kebab-case folder name`);
  else if (!next) state.findings.push(`${rel}: too deep; the deepest layout is <bucket>/<group>/<page>/<tab>.tab.tsx`);
  if (!next) return;
  if (next.level === 'bucket') state.buckets.push(name);
  scanDir(state, rel, next);
};

/**
 * @param {string} rootDir
 * @returns {{ files: ScreenFile[], findings: string[], buckets: string[] }}
 */
const scanScreens = (rootDir) => {
  const state = { rootDir, files: [], findings: [], buckets: [] };
  if (existsSync(join(rootDir, SCREENS_DIR))) scanDir(state, SCREENS_DIR, { level: 'root' });
  return { files: state.files, findings: [...state.findings, ...layoutFindings(state.files, state.buckets)], buckets: state.buckets };
};

export { scanScreens };
